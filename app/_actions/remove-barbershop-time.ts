// _actions/remove-barbershop-time.ts
import { db } from "./../_lib/prisma"

interface RemoveBarbershopTimeProps {
  bookingId: string
}

export async function removeBarbershopTime({
  bookingId,
}: RemoveBarbershopTimeProps) {
  await db.booking.delete({
    where: { id: bookingId },
  })
}
