// _actions/add-barbershop-time.ts
import { db } from "./../_lib/prisma";
export async function addBarbershopTime({ barbershopId, dayOfWeek, time, }) {
    await db.barbershopAvailability.create({
        data: {
            barbershopId,
            dayOfWeek,
            time,
        },
    });
}
