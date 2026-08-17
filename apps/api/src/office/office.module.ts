import { Module } from '@nestjs/common'
import { OfficeController } from './office.controller'
import { OfficeService } from './office.service'
import { ScoringModule } from '../scoring/scoring.module'

@Module({
  imports: [ScoringModule],
  controllers: [OfficeController],
  providers: [OfficeService],
})
export class OfficeModule {}
