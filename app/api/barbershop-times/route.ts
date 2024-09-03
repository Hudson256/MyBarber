import { NextRequest, NextResponse } from "next/server"
import { db } from "../../_lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const barbershopId = searchParams.get("barbershopId")
  const dateString = searchParams.get("date")
  const barberId = searchParams.get("barberId")

  if (!barbershopId || !dateString || !barberId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    )
  }

  const date = new Date(dateString)
  const dayOfWeek = date.getDay()

  try {
    const availabilities = await db.barbershopAvailability.findMany({
      where: {
        barbershopId: barbershopId,
        dayOfWeek: dayOfWeek,
      },
    })

    const bookings = await db.booking.findMany({
      where: {
        barbershopId: barbershopId,
        barberId: barberId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    })

    const bookedTimes = bookings.map((booking) =>
      booking.date.toTimeString().slice(0, 5),
    )

    const availableTimes = availabilities
      .map((av) => av.time)
      .filter((time) => !bookedTimes.includes(time))

    return NextResponse.json({ availableTimes })
  } catch (error) {
    console.error("Error fetching available times:", error)
    return NextResponse.json(
      { error: "Error fetching available times" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const { barbershopId, dayOfWeek, time } = await request.json()

  if (!barbershopId || dayOfWeek === undefined || !time) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    )
  }

  try {
    await db.barbershopAvailability.create({
      data: { barbershopId, dayOfWeek, time },
    })
    return NextResponse.json({ message: "Time added successfully" })
  } catch (error) {
    console.error("Error adding barbershop time:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { barbershopId, dayOfWeek, time } = await request.json()

  if (!barbershopId || dayOfWeek === undefined || !time) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    )
  }

  try {
    await db.barbershopAvailability.deleteMany({
      where: { barbershopId, dayOfWeek, time },
    })
    return NextResponse.json({ message: "Time removed successfully" })
  } catch (error) {
    console.error("Error removing barbershop time:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
