import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaPg({// Provide your database connection string
  connectionString: process.env.DATABASE_URL,
})

const prisma = globalForPrisma.prisma || new PrismaClient({// Pass the adapter to PrismaClient
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma// Prevent multiple instances in development

export default prisma