let prisma: any = null;

export function getPrisma() {
  if (prisma === null) {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient({
      log: ["error"],
    });
  }
  return prisma;
}
