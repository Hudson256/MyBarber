"use server";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
export const createBooking = async (params) => {
    const { barbershopId, serviceId, userId, barberId, date, phoneNumber } = params;
    return await db.$transaction(async (tx) => {
        const dayOfWeek = date.getDay();
        const time = date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        // Verifica novamente a disponibilidade
        const availability = await tx.barbershopAvailability.findFirst({
            where: {
                barbershopId,
                dayOfWeek,
                time,
            },
        });
        if (!availability) {
            throw new Error("Horário não disponível");
        }
        // Verifica se já existe um agendamento para este horário e barbeiro
        const existingBooking = await tx.booking.findFirst({
            where: {
                barbershopId,
                barberId,
                date,
            },
        });
        if (existingBooking) {
            throw new Error("Este horário já foi reservado para este barbeiro");
        }
        // Cria o agendamento
        const booking = await tx.booking.create({
            data: {
                service: {
                    connect: { id: serviceId },
                },
                user: {
                    connect: { id: userId },
                },
                barbershop: {
                    connect: { id: barbershopId },
                },
                barber: {
                    connect: { id: barberId },
                },
                date,
                phoneNumber,
            },
        });
        return booking;
    });
};
// Após a transação
export const finalizeBooking = async () => {
    revalidatePath("/");
    revalidatePath("/bookings");
};
