"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/app/_lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

interface ServiceData {
  name: string
  description: string
  imageUrl: string
  price: number | string | Decimal
  barbershopId: string
}

export async function addService(serviceData: ServiceData) {
  await db.barbershopService.create({
    data: {
      name: serviceData.name,
      description: serviceData.description,
      imageUrl: serviceData.imageUrl,
      price: new Decimal(serviceData.price.toString()),
      barbershop: {
        connect: { id: serviceData.barbershopId },
      },
    },
  })
  revalidatePath("/admin/barbershops/[id]")
}

export async function updateService(
  serviceId: string,
  serviceData: Partial<ServiceData>,
) {
  const updateData = { ...serviceData }
  if (updateData.price) {
    updateData.price = new Decimal(updateData.price.toString())
  }
  await db.barbershopService.update({
    where: { id: serviceId },
    data: updateData,
  })
  revalidatePath("/admin/barbershops/[id]")
}

export async function deleteService(serviceId: string) {
  await db.barbershopService.delete({
    where: { id: serviceId },
  })
  revalidatePath("/admin/barbershops/[id]")
}
