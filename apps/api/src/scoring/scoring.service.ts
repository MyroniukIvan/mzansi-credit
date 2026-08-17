import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Queue } from 'bullmq'
import { createQueueConnection } from '../core/queue/queue.connection'
import { SCORING_QUEUE } from '../core/queue/queue-names'
import { ScoringJobData } from './scoring.types'

@Injectable()
export class ScoringService implements OnModuleDestroy {
  private readonly queue = new Queue<ScoringJobData>(SCORING_QUEUE, {
    connection: createQueueConnection(),
  })

  async enqueue(applicationId: string): Promise<void> {
    await this.queue.add(
      SCORING_QUEUE,
      { applicationId },
      { jobId: applicationId }
    )
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue.close()
  }
}
