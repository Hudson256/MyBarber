// _actions/get-barbershop-times.ts
import { db } from "./../_lib/prisma"

interface GetBarbershopTimesProps {
  barbershopId: string
}

export async function getBarbershopTimes({
  barbershopId,
}: GetBarbershopTimesProps) {
  return await db.booking.findMany({
    where: { barbershopId },
    include: { service: true },
  })
}
