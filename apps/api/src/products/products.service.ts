import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from 'db'
import { PRISMA } from '../core/prisma/prisma.module'

@Injectable()
export class ProductsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  findActive() {
    return this.prisma.loanProduct.findMany({
      where: { isActive: true },
      orderBy: { minAmountCents: 'asc' },
      select: {
        id: true,
        name: true,
        minAmountCents: true,
        maxAmountCents: true,
        minTermMonths: true,
        maxTermMonths: true,
        monthlyInterestBps: true,
        initiationFeeBps: true,
        monthlyServiceFeeCents: true,
      },
    })
  }
}
