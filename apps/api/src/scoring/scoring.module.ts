import { Module } from '@nestjs/common'
import {
  NoopScoringDisbursement,
  ScoringDisbursement,
} from './scoring.disbursement'
import { ScoringService } from './scoring.service'
import { ScoringWorker } from './scoring.worker'

@Module({
  providers: [
    ScoringService,
    ScoringWorker,
    { provide: ScoringDisbursement, useClass: NoopScoringDisbursement },
  ],
  exports: [ScoringService],
})
export class ScoringModule {}
