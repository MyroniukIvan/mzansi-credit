import { config } from 'dotenv'
import { createPrismaClient } from 'db'

config({ path: '../../.env' })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

export const prisma = createPrismaClient(connectionString)
