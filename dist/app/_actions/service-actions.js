"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/app/_lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
export async function addService(serviceData) {
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
    });
    revalidatePath("/admin/barbershops/[id]");
}
export async function updateService(serviceId, serviceData) {
    const updateData = { ...serviceData };
    if (updateData.price) {
        updateData.price = new Decimal(updateData.price.toString());
    }
    await db.barbershopService.update({
        where: { id: serviceId },
        data: updateData,
    });
    revalidatePath("/admin/barbershops/[id]");
}
export async function deleteService(serviceId) {
    await db.barbershopService.delete({
        where: { id: serviceId },
    });
    revalidatePath("/admin/barbershops/[id]");
}
