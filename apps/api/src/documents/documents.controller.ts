import { Body, Controller, Get, Post } from '@nestjs/common'
import { z } from 'zod'
import { documentUploadSchema } from 'shared'
import type { DocumentUploadInput } from 'shared'
import { DocumentsService } from './documents.service'
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe'
import { CurrentUser } from '../core/decorators/decorators'
import type { SessionUser } from '../core/guards/auth.guard'

const documentConfirmSchema = documentUploadSchema.extend({
  s3Key: z.string().min(1),
})

type DocumentConfirmInput = z.infer<typeof documentConfirmSchema>

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  createUploadUrl(
    @Body(new ZodValidationPipe(documentUploadSchema))
    body: DocumentUploadInput,
    @CurrentUser() user: SessionUser
  ) {
    return this.documentsService.createUploadUrl(user.id, body)
  }

  @Post('confirm')
  confirm(
    @Body(new ZodValidationPipe(documentConfirmSchema))
    body: DocumentConfirmInput,
    @CurrentUser() user: SessionUser
  ) {
    return this.documentsService.confirm(user.id, body)
  }

  @Get()
  findAll(@CurrentUser() user: SessionUser) {
    return this.documentsService.findAllForUser(user.id)
  }
}
