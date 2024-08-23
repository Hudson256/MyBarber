"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreateRatingParams {
  barbershopId: string
  serviceId: string
  rating: number
  message?: string
}

export const createRating = async (params: CreateRatingParams) => {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("Usuário não autenticado")
  }

  await db.rating.create({
    data: {
      barbershopId: params.barbershopId,
      serviceId: params.serviceId,
      rating: params.rating,
      message: params.message,
    },
  })

  revalidatePath("/barbershops/[id]")
}

export const getRatings = async (barbershopId: string) => {
  return await db.rating.findMany({
    where: { barbershopId },
    include: {
      barbershopService: true, // Inclui o barbershopService se necessário
      barbershop: true, // Inclui o barbershop se necessário
    },
  })
}
