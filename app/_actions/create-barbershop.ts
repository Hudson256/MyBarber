"use server"

import { db } from "../_lib/prisma"
import { addDefaultHours } from "./add-default-hours"

interface CreateBarbershopParams {
  name: string
  address: string
  phones: string[]
  description: string
  imageUrl: string
}

export async function createBarbershop(data: CreateBarbershopParams) {
  const barbershop = await db.barbershop.create({
    data: {
      name: data.name,
      address: data.address,
      phones: data.phones,
      description: data.description,
      imageUrl: data.imageUrl,
    },
  })

  await addDefaultHours(barbershop.id)

  return barbershop
}
