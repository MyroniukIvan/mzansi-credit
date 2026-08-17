import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  InstallmentStatus,
  LoanStatus,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
} from 'db'
import { PRISMA } from '../core/prisma/prisma.module'
import { PayInstallmentInput } from './payments.schemas'
import { PaymentResult } from './payments.types'

const AUDIT_ENTITY_PAYMENT = 'payment'
const AUDIT_ENTITY_LOAN = 'loan'
const PAYABLE_INSTALLMENT_STATUSES: InstallmentStatus[] = [
  InstallmentStatus.pending,
  InstallmentStatus.overdue,
]

@Injectable()
export class PaymentsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async pay(
    userId: string,
    input: PayInstallmentInput
  ): Promise<PaymentResult> {
    const loan = await this.prisma.loan.findFirst({
      where: { id: input.loanId, userId },
      select: { id: true, status: true },
    })
    if (!loan) throw new NotFoundException()

    const installment = await this.prisma.installment.findUnique({
      where: {
        loanId_sequence: { loanId: input.loanId, sequence: input.sequence },
      },
      select: {
        id: true,
        sequence: true,
        status: true,
        paidAt: true,
        principalCents: true,
        interestCents: true,
        feeCents: true,
      },
    })
    if (!installment) throw new NotFoundException()

    const providerPaymentId = `mock_${input.loanId}_${input.sequence}`

    const existingPayment = await this.prisma.payment.findUnique({
      where: { providerPaymentId },
      select: { id: true },
    })
    if (existingPayment) {
      return {
        paymentId: existingPayment.id,
        installment: {
          sequence: installment.sequence,
          status: installment.status,
          paidAt: installment.paidAt?.toISOString() ?? null,
        },
        loanStatus: loan.status,
      }
    }

    if (!PAYABLE_INSTALLMENT_STATUSES.includes(installment.status)) {
      throw new ConflictException('Installment is already paid')
    }

    const amountCents =
      installment.principalCents +
      installment.interestCents +
      installment.feeCents
    const paidAt = new Date()

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          loanId: input.loanId,
          installmentId: installment.id,
          provider: PaymentProvider.mock,
          status: PaymentStatus.succeeded,
          amountCents,
          providerPaymentId,
        },
        select: { id: true },
      })

      await tx.installment.update({
        where: { id: installment.id },
        data: { status: InstallmentStatus.paid, paidAt },
      })

      await tx.auditLog.create({
        data: {
          actorId: userId,
          entityType: AUDIT_ENTITY_PAYMENT,
          entityId: payment.id,
          action: 'pay',
          toStatus: PaymentStatus.succeeded,
        },
      })

      const remainingCount = await tx.installment.count({
        where: {
          loanId: input.loanId,
          status: { not: InstallmentStatus.paid },
        },
      })

      let loanStatus: LoanStatus = loan.status
      if (remainingCount === 0) {
        loanStatus = LoanStatus.closed
        await tx.loan.update({
          where: { id: input.loanId },
          data: { status: LoanStatus.closed, closedAt: paidAt },
        })

        await tx.auditLog.create({
          data: {
            actorId: userId,
            entityType: AUDIT_ENTITY_LOAN,
            entityId: input.loanId,
            action: 'close',
            fromStatus: LoanStatus.active,
            toStatus: LoanStatus.closed,
          },
        })
      }

      return {
        paymentId: payment.id,
        installment: {
          sequence: installment.sequence,
          status: InstallmentStatus.paid,
          paidAt: paidAt.toISOString(),
        },
        loanStatus,
      }
    })
  }
}
