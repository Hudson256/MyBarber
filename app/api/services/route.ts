import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const barbershopId = searchParams.get("barbershopId")

  if (!barbershopId) {
    return NextResponse.json(
      { error: "barbershopId is required" },
      { status: 400 },
    )
  }

  try {
    const services = await db.barbershopService.findMany({
      where: {
        barbershopId: barbershopId,
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
