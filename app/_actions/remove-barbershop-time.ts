// _actions/remove-barbershop-time.ts
import { db } from "./../_lib/prisma"

interface RemoveBarbershopTimeProps {
  barbershopId: string
  dayOfWeek: number
  time: string
}

export async function removeBarbershopTime({
  barbershopId,
  dayOfWeek,
  time,
}: RemoveBarbershopTimeProps) {
  await db.barbershopAvailability.deleteMany({
    where: {
      barbershopId,
      dayOfWeek,
      time,
    },
  })
}
