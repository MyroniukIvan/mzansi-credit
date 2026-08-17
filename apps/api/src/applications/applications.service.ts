import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { PrismaClient } from 'db'
import { ApplicationInput, ApplicationSummary } from 'shared'
import { PRISMA } from '../core/prisma/prisma.module'

const CENTS_PER_RAND = 100

@Injectable()
export class ApplicationsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async create(
    userId: string,
    applicantName: string,
    input: ApplicationInput
  ): Promise<ApplicationSummary> {
    const product = await this.prisma.loanProduct.findFirst({
      where: { isActive: true },
    })
    if (!product) {
      throw new UnprocessableEntityException('No active loan product')
    }

    const application = await this.prisma.$transaction(async (tx) => {
      const created = await tx.loanApplication.create({
        data: {
          userId,
          productId: product.id,
          status: 'submitted',
          submittedAt: new Date(),
          amountCents: input.amount * CENTS_PER_RAND,
          termMonths: input.termMonths,
          idNumber: input.idNumber,
          phone: input.phone,
          address: input.address,
          employer: input.employer,
          incomeCents: input.monthlyIncome * CENTS_PER_RAND,
          expensesCents: input.monthlyExpenses * CENTS_PER_RAND,
        },
        select: {
          id: true,
          amountCents: true,
          termMonths: true,
          status: true,
          submittedAt: true,
        },
      })

      await tx.auditLog.create({
        data: {
          actorId: userId,
          entityType: 'loan_application',
          entityId: created.id,
          action: 'submit',
          toStatus: created.status,
        },
      })

      return created
    })

    return {
      id: application.id,
      applicantName,
      amount: application.amountCents / CENTS_PER_RAND,
      termMonths: application.termMonths,
      status: application.status,
      submittedAt: (application.submittedAt ?? new Date()).toISOString(),
    }
  }

  async findAllForUser(userId: string): Promise<ApplicationSummary[]> {
    const applications = await this.prisma.loanApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amountCents: true,
        termMonths: true,
        status: true,
        submittedAt: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    })

    return applications.map((application) => ({
      id: application.id,
      applicantName: application.user.name,
      amount: application.amountCents / CENTS_PER_RAND,
      termMonths: application.termMonths,
      status: application.status,
      submittedAt: (
        application.submittedAt ?? application.createdAt
      ).toISOString(),
    }))
  }

  async findOneForUser(userId: string, id: string) {
    const application = await this.prisma.loanApplication.findFirst({
      where: { id, userId },
      include: { product: true, documents: true },
    })
    if (!application) throw new NotFoundException()
    return application
  }
}
