import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { OfficeService } from './office.service'
import {
  officeDecisionSchema,
  officeDocumentReviewSchema,
  officeQueueQuerySchema,
} from './office.schemas'
import type {
  OfficeDecisionInput,
  OfficeDocumentReviewInput,
  OfficeQueueQuery,
} from './office.schemas'
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe'
import { CurrentUser, Roles } from '../core/decorators/decorators'
import type { SessionUser } from '../core/guards/auth.guard'

@Roles('underwriter', 'admin')
@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get('applications')
  findQueue(
    @Query(new ZodValidationPipe(officeQueueQuerySchema))
    query: OfficeQueueQuery
  ) {
    return this.officeService.findQueue(query.status)
  }

  @Get('applications/:id')
  findOne(@Param('id') id: string) {
    return this.officeService.findOne(id)
  }

  @Post('applications/:id/decision')
  decide(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(officeDecisionSchema))
    body: OfficeDecisionInput,
    @CurrentUser() user: SessionUser
  ) {
    return this.officeService.decide(id, user.id, body)
  }

  @Post('documents/:id/review')
  reviewDocument(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(officeDocumentReviewSchema))
    body: OfficeDocumentReviewInput,
    @CurrentUser() user: SessionUser
  ) {
    return this.officeService.reviewDocument(id, user.id, body)
  }
}
