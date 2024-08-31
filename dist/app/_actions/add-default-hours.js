import { db } from "../_lib/prisma";
import { DEFAULT_HOURS } from "../_constants/constants";
export async function addDefaultHours(barbershopId) {
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const defaultAvailabilities = daysOfWeek.flatMap(dayOfWeek => DEFAULT_HOURS.map(time => ({
        barbershopId,
        dayOfWeek,
        time,
    })));
    await db.barbershopAvailability.createMany({
        data: defaultAvailabilities,
        skipDuplicates: true,
    });
    await db.barbershop.update({
        where: { id: barbershopId },
        data: { hasDefaultHours: true },
    });
}
