"use server";
import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
export const createRating = async (params) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Usuário não autenticado");
    }
    const userName = session.user.name || "Anonymous"; // Ajuste conforme necessário
    await db.rating.create({
        data: {
            barbershopId: params.barbershopId,
            serviceId: params.serviceId,
            rating: params.rating,
            message: params.message,
            userName: userName, // Inclua o userName
        },
    });
    revalidatePath("/barbershops/[id]");
};
export const getRatings = async (barbershopId) => {
    return await db.rating.findMany({
        where: { barbershopId },
        include: {
            barbershopService: true, // Inclui o barbershopService se necessário
            barbershop: true, // Inclui o barbershop se necessário
        },
    });
};
