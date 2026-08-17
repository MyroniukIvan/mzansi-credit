import { config } from 'dotenv'
import { createPrismaClient } from '../src/index'

config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const prisma = createPrismaClient(connectionString)

const products = [
  {
    id: 'prod_payday',
    name: 'Payday',
    minAmountCents: 50000,
    maxAmountCents: 400000,
    minTermMonths: 1,
    maxTermMonths: 3,
    monthlyInterestBps: 600,
    initiationFeeBps: 1000,
    monthlyServiceFeeCents: 6000,
  },
  {
    id: 'prod_standard',
    name: 'Standard',
    minAmountCents: 50000,
    maxAmountCents: 1500000,
    minTermMonths: 1,
    maxTermMonths: 6,
    monthlyInterestBps: 500,
    initiationFeeBps: 1000,
    monthlyServiceFeeCents: 6000,
  },
]

async function main() {
  for (const product of products) {
    await prisma.loanProduct.upsert({
      where: { id: product.id },
      create: product,
      update: product,
    })
  }
  console.log(`Seeded ${products.length} loan products`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
