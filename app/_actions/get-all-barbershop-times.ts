import { db } from "../_lib/prisma"

export async function getAllBarbershopTimes(
  barbershopId: string,
): Promise<string[]> {
  const times = await db.barbershopAvailability.findMany({
    where: { barbershopId },
    select: { time: true },
    distinct: ["time"],
  })
  return times.map((t) => t.time).sort()
}
