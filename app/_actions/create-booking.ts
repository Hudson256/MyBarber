"use server"

import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"

interface CreateBookingParams {
  barbershopId: string
  serviceId: string
  userId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const { barbershopId, serviceId, userId, date } = params

  const dayOfWeek = date.getDay()
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const availability = await db.barbershopAvailability.findFirst({
    where: {
      barbershopId,
      dayOfWeek,
      time,
    },
  })

  if (!availability) {
    throw new Error("Horário não disponível")
  }

  await db.booking.create({
    data: {
      serviceId,
      userId,
      date,
      barbershopId,
    },
  })

  revalidatePath("/")
  revalidatePath("/bookings")
}
