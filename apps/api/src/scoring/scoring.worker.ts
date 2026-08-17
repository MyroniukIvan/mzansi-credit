import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Job, Worker } from 'bullmq'
import { ApplicationStatus, PrismaClient } from 'db'
import { PRISMA } from '../core/prisma/prisma.module'
import { createQueueConnection } from '../core/queue/queue.connection'
import { SCORING_QUEUE } from '../core/queue/queue-names'
import { ScoringDisbursement } from './scoring.disbursement'
import { ScoringJobData } from './scoring.types'
import { evaluateApplication } from './scoring.utils'

const AUDIT_ENTITY_TYPE = 'loan_application'

@Injectable()
export class ScoringWorker implements OnModuleInit, OnModuleDestroy {
  private worker: Worker<ScoringJobData> | undefined

  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly disbursement: ScoringDisbursement
  ) {}

  onModuleInit(): void {
    this.worker = new Worker<ScoringJobData>(
      SCORING_QUEUE,
      (job) => this.process(job),
      { connection: createQueueConnection() }
    )
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close()
  }

  private async process(job: Job<ScoringJobData>): Promise<void> {
    const { applicationId } = job.data

    const application = await this.prisma.loanApplication.findUniqueOrThrow({
      where: { id: applicationId },
      include: { product: true },
    })

    const activeLoan = await this.prisma.loan.findFirst({
      where: { userId: application.userId, status: 'active' },
      select: { id: true },
    })

    await this.prisma.$transaction(async (tx) => {
      await tx.loanApplication.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.scoring },
      })

      await tx.auditLog.create({
        data: {
          entityType: AUDIT_ENTITY_TYPE,
          entityId: applicationId,
          action: 'score',
          fromStatus: application.status,
          toStatus: ApplicationStatus.scoring,
        },
      })
    })

    const result = evaluateApplication({
      amountCents: application.amountCents,
      termMonths: application.termMonths,
      incomeCents: application.incomeCents ?? 0,
      expensesCents: application.expensesCents ?? 0,
      product: {
        minAmountCents: application.product.minAmountCents,
        maxAmountCents: application.product.maxAmountCents,
        minTermMonths: application.product.minTermMonths,
        maxTermMonths: application.product.maxTermMonths,
        monthlyInterestBps: application.product.monthlyInterestBps,
        monthlyServiceFeeCents: application.product.monthlyServiceFeeCents,
      },
      hasActiveLoan: Boolean(activeLoan),
    })

    await this.prisma.$transaction(async (tx) => {
      await tx.loanApplication.update({
        where: { id: applicationId },
        data: {
          status: result.decision,
          decisionReason: result.reason,
          score: result.score,
          decidedAt: new Date(),
        },
      })

      await tx.auditLog.create({
        data: {
          entityType: AUDIT_ENTITY_TYPE,
          entityId: applicationId,
          action: 'decision',
          fromStatus: ApplicationStatus.scoring,
          toStatus: result.decision,
        },
      })
    })

    if (result.decision === 'approved') {
      await this.disbursement.disburse(applicationId)
    }
  }
}
