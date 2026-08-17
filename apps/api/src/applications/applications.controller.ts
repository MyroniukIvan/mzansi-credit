import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { applicationSchema } from 'shared'
import type { ApplicationInput } from 'shared'
import { ApplicationsService } from './applications.service'
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe'
import { CurrentUser } from '../core/decorators/decorators'
import type { SessionUser } from '../core/guards/auth.guard'

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(applicationSchema)) body: ApplicationInput,
    @CurrentUser() user: SessionUser
  ) {
    return this.applicationsService.create(user.id, user.name, body)
  }

  @Get()
  findAll(@CurrentUser() user: SessionUser) {
    return this.applicationsService.findAllForUser(user.id)
  }

  @Get(':id')
  findOne(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.applicationsService.findOneForUser(user.id, id)
  }
}
