var _a;
import { PrismaClient } from "@prisma/client";
var prismaClientSingleton = function () {
    return new PrismaClient();
};
var globalForPrisma = globalThis;
export var db = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = db;
