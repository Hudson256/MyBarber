"use server";
import { db } from "../_lib/prisma";
import { addDefaultHours } from "./add-default-hours";
export async function createBarbershop(data) {
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
    });
    await addDefaultHours(barbershop.id);
    return barbershop;
}
