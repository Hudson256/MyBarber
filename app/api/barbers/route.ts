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
