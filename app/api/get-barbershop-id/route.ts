import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    )
  }

  try {
    const barbershop = await db.barbershop.findFirst({
      where: {
        stripeSessionId: sessionId,
      },
    })

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbershop not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ barbershopId: barbershop.id })
  } catch (error) {
    console.error("Error fetching barbershop:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
