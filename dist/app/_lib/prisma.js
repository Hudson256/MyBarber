import { PrismaClient } from "@prisma/client";
const prismaClientSingleton = () => {
    return new PrismaClient();
};
const globalForPrisma = globalThis;
export const db = globalForPrisma.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = db;
