"use server"

import { db } from "../_lib/prisma"
import { addDefaultHours } from "./add-default-hours"

interface CreateBarbershopParams {
  name: string
  address: string
  phones: string[]
  description: string
  imageUrl: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripeSessionId?: string
}

async function addDefaultBarbers(barbershopId: string) {
  const DEFAULT_BARBERS = [
    { name: "João Silva", description: "Especialista em cortes clássicos" },
    { name: "Maria Oliveira", description: "Expert em barbas e bigodes" },
    { name: "Carlos Santos", description: "Mestre em cortes modernos" },
  ]

  const barbers = DEFAULT_BARBERS.map((barber) => ({
    ...barber,
    barbershopId,
  }))

  await db.barber.createMany({ data: barbers })
}

export async function createBarbershop(data: CreateBarbershopParams) {
  const barbershop = await db.barbershop.create({
    data: {
      name: data.name,
      address: data.address,
      phones: data.phones,
      description: data.description,
      imageUrl: data.imageUrl,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripeSessionId: data.stripeSessionId,
    },
  })

  await addDefaultHours(barbershop.id)
  await addDefaultBarbers(barbershop.id)

  return barbershop
}
