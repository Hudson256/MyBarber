import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function cleanDatabase() {
  try {
    await prisma.booking.deleteMany()
    await prisma.barbershopService.deleteMany()
    await prisma.barbershopAvailability.deleteMany()
    await prisma.barber.deleteMany()
    await prisma.barbershopUser.deleteMany()
    await prisma.barbershop.deleteMany()
    await prisma.user.deleteMany()

    console.log("Banco de dados limpo com sucesso!")
  } catch (error) {
    console.error("Erro ao limpar o banco de dados:", error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()
