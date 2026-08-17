import { Controller, Get, Param } from '@nestjs/common'
import { LoansService } from './loans.service'
import { CurrentUser } from '../core/decorators/decorators'
import type { SessionUser } from '../core/guards/auth.guard'

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  findAll(@CurrentUser() user: SessionUser) {
    return this.loansService.findAllForUser(user.id)
  }

  @Get(':id')
  findOne(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.loansService.findOneForUser(user.id, id)
  }
}
