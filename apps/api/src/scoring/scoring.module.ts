import { Module } from '@nestjs/common'
import { ScoringDisbursement } from './scoring.disbursement'
import { ScoringService } from './scoring.service'
import { ScoringWorker } from './scoring.worker'
import { LoansModule } from '../loans/loans.module'
import { LoansService } from '../loans/loans.service'

@Module({
  imports: [LoansModule],
  providers: [
    ScoringService,
    ScoringWorker,
    { provide: ScoringDisbursement, useExisting: LoansService },
  ],
  exports: [ScoringService, ScoringDisbursement],
})
export class ScoringModule {}
