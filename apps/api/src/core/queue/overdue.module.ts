import { Module } from '@nestjs/common'
import { OverdueWorker } from './overdue.worker'

@Module({
  providers: [OverdueWorker],
  exports: [OverdueWorker],
})
export class OverdueModule {}
