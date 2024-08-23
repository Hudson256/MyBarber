/* eslint-disable no-unused-vars */
// app/_lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
  var cachedPrisma: PrismaClient | undefined
}

const prisma: PrismaClient =
  process.env.NODE_ENV === "production"
    ? new PrismaClient()
    : global.cachedPrisma || (global.cachedPrisma = new PrismaClient())

export const db = prisma
