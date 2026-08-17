import { Module } from '@nestjs/common'
import { OfficeController } from './office.controller'
import { OfficeService } from './office.service'
import { ScoringModule } from '../scoring/scoring.module'
import { DocumentsModule } from '../documents/documents.module'

@Module({
  imports: [ScoringModule, DocumentsModule],
  controllers: [OfficeController],
  providers: [OfficeService],
})
export class OfficeModule {}
