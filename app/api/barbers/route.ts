import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const barbershopId = request.nextUrl.searchParams.get("barbershopId")

  if (!barbershopId) {
    return NextResponse.json(
      { error: "BarbershopId é obrigatório" },
      { status: 400 },
    )
  }

  try {
    const barbers = await prisma.barber.findMany({
      where: { barbershopId: barbershopId },
    })

    return NextResponse.json(barbers)
  } catch (error) {
    console.error("Erro ao buscar barbeiros:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, imageUrl, barbershopId } = await request.json()

    if (!name || !barbershopId) {
      return NextResponse.json(
        { error: "Nome e barbershopId são obrigatórios" },
        { status: 400 },
      )
    }

    const barber = await prisma.barber.create({
      data: { name, description, imageUrl, barbershopId },
    })

    return NextResponse.json(barber, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar barbeiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  const barberId = request.nextUrl.searchParams.get("barberId")

  if (!barberId) {
    return NextResponse.json(
      { error: "ID do barbeiro é obrigatório" },
      { status: 400 },
    )
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.rating.deleteMany({
        where: { barberId: barberId },
      })

      await tx.booking.deleteMany({
        where: { barberId: barberId },
      })

      await tx.barber.delete({
        where: { id: barberId },
      })
    })

    return NextResponse.json({ message: "Barbeiro removido com sucesso" })
  } catch (error) {
    console.error("Erro detalhado ao remover barbeiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor", details: (error as Error).message },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
