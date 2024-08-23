import { NextResponse } from "next/server"
import { db } from "../../../_lib/prisma" // Ajuste o caminho conforme a sua estrutura

// Função para lidar com requisições POST
export async function POST(request: Request) {
  try {
    // Obtenha o id da barbearia da URL
    const url = new URL(request.url)
    const barbershopId = url.pathname.split("/")[2]

    // Parse do corpo da requisição
    const data = await request.json()
    const { serviceId, rating, message, userName, userAvatar } = data

    // Validação básica dos dados
    if (!serviceId || rating === undefined || !message || !userName) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 })
    }

    // Salve a avaliação no banco de dados usando Prisma
    await db.rating.create({
      data: {
        barbershopId,
        serviceId,
        rating,
        message,
        userName, // Adiciona o nome do usuário
        userAvatar, // Adiciona o avatar do usuário
      },
    })

    // Resposta de sucesso
    return NextResponse.json({ message: "Rating submitted successfully!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to submit rating" },
      { status: 500 },
    )
  }
}
