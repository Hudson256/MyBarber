import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const barbershopId = params.id
  const { name, description, imageUrl, address } = await request.json()

  try {
    const barbershopUser = await db.barbershopUser.findUnique({
      where: {
        userId_barbershopId: {
          userId: session.user.id,
          barbershopId: barbershopId,
        },
      },
    })

    if (!barbershopUser) {
      return NextResponse.json(
        { error: "Não autorizado a editar esta barbearia" },
        { status: 403 },
      )
    }

    const updatedBarbershop = await db.barbershop.update({
      where: { id: barbershopId },
      data: { name, description, imageUrl, address },
    })

    return NextResponse.json(updatedBarbershop)
  } catch (error) {
    console.error("Erro ao atualizar barbearia:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar barbearia" },
      { status: 500 },
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const barbershopId = params.id

  try {
    const barbershop = await db.barbershop.findUnique({
      where: { id: barbershopId },
    })

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 },
      )
    }

    return NextResponse.json(barbershop)
  } catch (error) {
    console.error("Erro ao buscar barbearia:", error)
    return NextResponse.json(
      { error: "Erro ao buscar barbearia" },
      { status: 500 },
    )
  }
}
