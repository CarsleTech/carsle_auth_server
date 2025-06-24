// lib/db.ts

import { PrismaClient } from '../generated/prisma'

const globalForPrisma = globalThis

export const prisma =  new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma