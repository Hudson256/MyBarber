import { NextRequest, NextResponse } from "next/server"
import { db } from "../../_lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const barbershopId = searchParams.get("barbershopId")
  const date = searchParams.get("date")

  if (!barbershopId || !date) {
    return NextResponse.json(
      { error: "Missing barbershopId or date" },
      { status: 400 },
    )
  }

  try {
    const dayOfWeek = new Date(date).getDay()

    // Buscar todos os horários disponíveis para o dia da semana
    const availableTimes = await db.barbershopAvailability.findMany({
      where: {
        barbershopId,
        dayOfWeek,
      },
      select: { time: true },
    })

    // Buscar agendamentos existentes para a data específica
    const bookings = await db.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      },
      select: { date: true },
    })

    // Converter os horários de agendamentos para o formato de string (HH:mm)
    const bookedTimes = bookings.map((booking) =>
      booking.date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    )

    // Filtrar os horários disponíveis, removendo os já agendados
    const availableTimesFiltered = availableTimes
      .map((t) => t.time)
      .filter((time) => !bookedTimes.includes(time))

    return NextResponse.json({ availableTimes: availableTimesFiltered })
  } catch (error) {
    console.error("Error fetching barbershop times:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
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
