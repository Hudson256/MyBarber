import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function POST(request: Request) {
  const { userId, barbershopId } = await request.json()

  try {
    const barbershopUser = await db.barbershopUser.findUnique({
      where: {
        userId_barbershopId: {
          userId: userId,
          barbershopId: barbershopId,
        },
      },
    })

    return NextResponse.json({ temPermissao: !!barbershopUser })
  } catch (error) {
    console.error("Erro ao verificar permissão:", error)
    return NextResponse.json(
      { error: "Falha ao verificar permissão do usuário" },
      { status: 500 },
    )
  }
}
