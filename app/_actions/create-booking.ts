"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreateBookingParams {
  serviceId: string
  date: Date
  barbershopId: string
}

// Definindo o tipo de usuário com ID
interface User {
  id: string
  name?: string
  email?: string
  image?: string
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)

  // Assegure que o tipo de usuário é o esperado
  if (!session || !session.user || !(session.user as User).id) {
    throw new Error("Usuário não autenticado")
  }

  await db.booking.create({
    data: {
      ...params,
      userId: (session.user as User).id,
    },
  })

  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
