import { NextRequest, NextResponse } from "next/server"
import { db } from "../../_lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const barbershopId = searchParams.get("barbershopId")
  const date = searchParams.get("date")

  if (!barbershopId || !date) {
    return NextResponse.json(
      { error: "Faltam barbershopId ou date" },
      { status: 400 },
    )
  }

  try {
    const appointments = await db.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
        barber: {
          select: {
            name: true,
          },
        },
      },
    })

    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      clientName: appointment.user?.name || "Cliente não identificado",
      phoneNumber: appointment.phoneNumber || "",
      serviceName: appointment.service?.name || "Serviço não especificado",
      barberName: appointment.barber?.name || "Barbeiro não especificado",
    }))

    return NextResponse.json(formattedAppointments)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
