// _actions/add-barbershop-time.ts
import { db } from "./../_lib/prisma"

interface AddBarbershopTimeProps {
  barbershopId: string
  dayOfWeek: number
  time: string
}

export async function addBarbershopTime({
  barbershopId,
  dayOfWeek,
  time,
}: AddBarbershopTimeProps) {
  await db.barbershopAvailability.create({
    data: {
      barbershopId,
      dayOfWeek,
      time,
    },
  })
}
