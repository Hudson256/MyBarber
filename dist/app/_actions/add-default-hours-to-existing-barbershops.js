import { db } from "../_lib/prisma";
import { addDefaultHours } from "./add-default-hours";
export async function addDefaultHoursToExistingBarbershops() {
    const barbershopsWithoutDefaultHours = await db.barbershop.findMany({
        where: {
            hasDefaultHours: false
        },
        select: {
            id: true
        }
    });
    for (const barbershop of barbershopsWithoutDefaultHours) {
        await addDefaultHours(barbershop.id);
        console.log(`Added default hours to barbershop ${barbershop.id}`);
    }
    console.log(`Added default hours to ${barbershopsWithoutDefaultHours.length} barbershops`);
}
