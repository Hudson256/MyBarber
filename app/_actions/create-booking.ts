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

  return await db.$transaction(async (tx) => {
    const dayOfWeek = date.getDay()
    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Verifica novamente a disponibilidade
    const availability = await tx.barbershopAvailability.findFirst({
      where: {
        barbershopId,
        dayOfWeek,
        time,
      },
    })

    if (!availability) {
      throw new Error("Horário não disponível")
    }

    // Verifica se já existe um agendamento para este horário
    const existingBooking = await tx.booking.findFirst({
      where: {
        barbershopId,
        date,
      },
    })

    if (existingBooking) {
      throw new Error("Este horário já foi reservado")
    }

    // Cria o agendamento
    const booking = await tx.booking.create({
      data: {
        serviceId,
        userId,
        date,
        barbershopId,
      },
    })

    // Se você precisar atualizar algo na disponibilidade, faça aqui
    // Por exemplo, se houver um campo para marcar como reservado:
    // await tx.barbershopAvailability.update({
    //   where: { id: availability.id },
    //   data: { /* atualize os campos necessários */ },
    // })

    return booking
  })
}

// Após a transação
export const finalizeBooking = async () => {
  revalidatePath("/")
  revalidatePath("/bookings")
}
