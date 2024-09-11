// _actions/remove-barbershop-time.ts
import { db } from "./../_lib/prisma";
export async function removeBarbershopTime({ barbershopId, dayOfWeek, time, }) {
    await db.barbershopAvailability.deleteMany({
        where: {
            barbershopId,
            dayOfWeek,
            time,
        },
    });
}
