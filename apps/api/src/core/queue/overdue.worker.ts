import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Job, Queue, Worker } from 'bullmq'
import { InstallmentStatus, PrismaClient } from 'db'
import { PRISMA } from '../prisma/prisma.module'
import { createQueueConnection } from './queue.connection'
import { OVERDUE_QUEUE } from './queue-names'

const AUDIT_ENTITY_TYPE = 'installment'
const OVERDUE_CRON_PATTERN = '0 3 * * *'
const REPEAT_JOB_ID = 'overdue-daily'
const BOOT_JOB_ID = 'overdue-boot'

function startOfUtcDay(timestamp: number): Date {
  const date = new Date(timestamp)
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

@Injectable()
export class OverdueWorker implements OnModuleInit, OnModuleDestroy {
  private queue: Queue | undefined
  private worker: Worker | undefined

  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async onModuleInit(): Promise<void> {
    this.queue = new Queue(OVERDUE_QUEUE, {
      connection: createQueueConnection(),
    })
    this.worker = new Worker(OVERDUE_QUEUE, (job) => this.process(job), {
      connection: createQueueConnection(),
    })

    await this.queue.upsertJobScheduler(REPEAT_JOB_ID, {
      pattern: OVERDUE_CRON_PATTERN,
    })
    await this.queue.add(OVERDUE_QUEUE, {}, { jobId: BOOT_JOB_ID })
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close()
    await this.queue?.close()
  }

  private async process(job: Job): Promise<void> {
    const cutoff = startOfUtcDay(job.timestamp)

    const overdueInstallments = await this.prisma.installment.findMany({
      where: { status: InstallmentStatus.pending, dueDate: { lt: cutoff } },
      select: { id: true },
    })

    for (const installment of overdueInstallments) {
      await this.prisma.$transaction(async (tx) => {
        await tx.installment.update({
          where: { id: installment.id },
          data: { status: InstallmentStatus.overdue },
        })

        await tx.auditLog.create({
          data: {
            entityType: AUDIT_ENTITY_TYPE,
            entityId: installment.id,
            action: 'overdue',
            fromStatus: InstallmentStatus.pending,
            toStatus: InstallmentStatus.overdue,
          },
        })
      })
    }
  }
}
