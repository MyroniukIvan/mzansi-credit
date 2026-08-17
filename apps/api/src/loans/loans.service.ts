import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaClient } from 'db'
import { buildSchedule, installmentTotalCents } from 'shared'
import { PRISMA } from '../core/prisma/prisma.module'
import { LoanDetail, LoanSummary } from './loans.types'

const AUDIT_ENTITY_APPLICATION = 'loan_application'
const AUDIT_ENTITY_LOAN = 'loan'
const PENDING_INSTALLMENT_STATUSES = ['pending', 'overdue']

function addMonths(date: Date, months: number): Date {
  const result = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
  result.setUTCMonth(result.getUTCMonth() + months)
  return result
}

@Injectable()
export class LoansService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async disburse(applicationId: string): Promise<void> {
    const application = await this.prisma.loanApplication.findUniqueOrThrow({
      where: { id: applicationId },
      select: {
        status: true,
        userId: true,
        amountCents: true,
        termMonths: true,
        product: {
          select: {
            monthlyInterestBps: true,
            initiationFeeBps: true,
            monthlyServiceFeeCents: true,
          },
        },
      },
    })

    const existingLoan = await this.prisma.loan.findUnique({
      where: { applicationId },
      select: { id: true },
    })
    if (existingLoan) return

    if (application.status !== 'approved') {
      throw new ConflictException(
        'Application must be approved before disbursement'
      )
    }

    const disbursedAt = new Date()
    const schedule = buildSchedule({
      principalCents: application.amountCents,
      termMonths: application.termMonths,
      monthlyInterestBps: application.product.monthlyInterestBps,
      initiationFeeBps: application.product.initiationFeeBps,
      monthlyServiceFeeCents: application.product.monthlyServiceFeeCents,
    })

    await this.prisma.$transaction(async (tx) => {
      const loan = await tx.loan.create({
        data: {
          applicationId,
          userId: application.userId,
          principalCents: application.amountCents,
          monthlyInterestBps: application.product.monthlyInterestBps,
          termMonths: application.termMonths,
          status: 'active',
          disbursedAt,
        },
        select: { id: true },
      })

      await tx.installment.createMany({
        data: schedule.map((installment) => ({
          loanId: loan.id,
          sequence: installment.sequence,
          dueDate: addMonths(disbursedAt, installment.sequence),
          principalCents: installment.principalCents,
          interestCents: installment.interestCents,
          feeCents: installment.feeCents,
        })),
      })

      await tx.loanApplication.update({
        where: { id: applicationId },
        data: { status: 'disbursed' },
      })

      await tx.auditLog.create({
        data: {
          entityType: AUDIT_ENTITY_APPLICATION,
          entityId: applicationId,
          action: 'disburse',
          fromStatus: application.status,
          toStatus: 'disbursed',
        },
      })

      await tx.auditLog.create({
        data: {
          entityType: AUDIT_ENTITY_LOAN,
          entityId: loan.id,
          action: 'create',
          toStatus: 'active',
        },
      })
    })
  }

  async findAllForUser(userId: string): Promise<LoanSummary[]> {
    const loans = await this.prisma.loan.findMany({
      where: { userId },
      orderBy: { disbursedAt: 'desc' },
      select: {
        id: true,
        principalCents: true,
        status: true,
        disbursedAt: true,
        termMonths: true,
        installments: {
          orderBy: { sequence: 'asc' },
          select: {
            sequence: true,
            dueDate: true,
            principalCents: true,
            interestCents: true,
            feeCents: true,
            status: true,
          },
        },
      },
    })

    return loans.map((loan) => {
      const paidCount = loan.installments.filter(
        (installment) => installment.status === 'paid'
      ).length
      const nextInstallment =
        loan.installments.find((installment) =>
          PENDING_INSTALLMENT_STATUSES.includes(installment.status)
        ) ?? null

      return {
        id: loan.id,
        principalCents: loan.principalCents,
        status: loan.status,
        disbursedAt: loan.disbursedAt.toISOString(),
        termMonths: loan.termMonths,
        nextInstallment: nextInstallment
          ? {
              sequence: nextInstallment.sequence,
              dueDate: nextInstallment.dueDate.toISOString(),
              totalCents: installmentTotalCents(nextInstallment),
            }
          : null,
        paidCount,
        totalCount: loan.installments.length,
      }
    })
  }

  async findOneForUser(userId: string, id: string): Promise<LoanDetail> {
    const loan = await this.prisma.loan.findFirst({
      where: { id, userId },
      select: {
        id: true,
        principalCents: true,
        status: true,
        disbursedAt: true,
        termMonths: true,
        monthlyInterestBps: true,
        installments: {
          orderBy: { sequence: 'asc' },
          select: {
            sequence: true,
            dueDate: true,
            principalCents: true,
            interestCents: true,
            feeCents: true,
            status: true,
            paidAt: true,
          },
        },
      },
    })
    if (!loan) throw new NotFoundException()

    return {
      id: loan.id,
      principalCents: loan.principalCents,
      status: loan.status,
      disbursedAt: loan.disbursedAt.toISOString(),
      termMonths: loan.termMonths,
      monthlyInterestBps: loan.monthlyInterestBps,
      installments: loan.installments.map((installment) => ({
        sequence: installment.sequence,
        dueDate: installment.dueDate.toISOString(),
        principalCents: installment.principalCents,
        interestCents: installment.interestCents,
        feeCents: installment.feeCents,
        status: installment.status,
        paidAt: installment.paidAt?.toISOString() ?? null,
      })),
    }
  }
}
