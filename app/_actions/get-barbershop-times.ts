import { db } from "../_lib/prisma"
import { endOfDay, startOfDay } from "date-fns"
import { addDefaultHoursToExistingBarbershops } from "./add-default-hours-to-existing-barbershops"

interface GetBarbershopTimesProps {
  barbershopId: string
  date: Date
}

export async function getBarbershopTimes({
  barbershopId,
  date,
}: GetBarbershopTimesProps) {
  try {
    const dayOfWeek = date.getDay()
    console.log(
      `Fetching times for barbershop ${barbershopId} on day ${dayOfWeek}`,
    )

    let barbershopAvailability = await db.barbershopAvailability.findMany({
      where: {
        barbershopId,
        dayOfWeek,
      },
      select: {
        time: true,
      },
    })

    if (barbershopAvailability.length === 0) {
      console.log(
        `No availability found for barbershop ${barbershopId}. Adding default hours.`,
      )
      await addDefaultHoursToExistingBarbershops()
      barbershopAvailability = await db.barbershopAvailability.findMany({
        where: {
          barbershopId,
          dayOfWeek,
        },
        select: {
          time: true,
        },
      })
    }

    console.log(
      `Found ${barbershopAvailability.length} availabilities:`,
      barbershopAvailability,
    )

    const availableTimes = barbershopAvailability.map((a) => a.time)

    const bookings = await db.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      select: {
        date: true,
      },
    })

    console.log(`Found ${bookings.length} bookings:`, bookings)

    const bookedTimes = bookings.map((booking) =>
      booking.date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    )

    const finalAvailableTimes = availableTimes
      .filter((time) => !bookedTimes.includes(time))
      .sort()

    console.log(`Final available times: ${finalAvailableTimes.join(", ")}`)

    return finalAvailableTimes
  } catch (error) {
    console.error("Error in getBarbershopTimes:", error)
    throw error
  }
}
