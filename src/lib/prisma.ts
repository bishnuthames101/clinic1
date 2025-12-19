import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Check if using Prisma Postgres (local dev) or regular PostgreSQL (Supabase)
const isPrismaPostgres = process.env.DATABASE_URL?.startsWith('prisma+postgres://')

// For regular PostgreSQL (Supabase), use the adapter
let adapter: PrismaPg | undefined

if (!isPrismaPostgres && process.env.DATABASE_URL) {
  const pool = globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool
  adapter = new PrismaPg(pool)
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // undefined for Prisma Postgres, PrismaPg adapter for Supabase
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
