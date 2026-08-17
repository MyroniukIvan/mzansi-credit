import { Body, Controller, Post } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { payInstallmentSchema } from './payments.schemas'
import type { PayInstallmentInput } from './payments.schemas'
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe'
import { CurrentUser } from '../core/decorators/decorators'
import type { SessionUser } from '../core/guards/auth.guard'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  pay(
    @Body(new ZodValidationPipe(payInstallmentSchema))
    body: PayInstallmentInput,
    @CurrentUser() user: SessionUser
  ) {
    return this.paymentsService.pay(user.id, body)
  }
}
