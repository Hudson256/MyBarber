import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { logger } from "@/app/_lib/logger"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  logger.log("Received request for session ID:", sessionId)

  if (!sessionId || typeof sessionId !== "string") {
    logger.error("Invalid or missing session ID")
    return NextResponse.json(
      { error: "Session ID is required and must be a string" },
      { status: 400 },
    )
  }

  try {
    const barbershop = await db.barbershop.findFirst({
      where: {
        stripeSessionId: sessionId,
      },
    })

    logger.log("Database query result:", barbershop)

    if (!barbershop) {
      logger.error(`Barbershop not found for session ID: ${sessionId}`)
      return NextResponse.json(
        { error: "Barbershop not found" },
        { status: 404 },
      )
    }

    logger.log(`Barbershop found for session ID: ${sessionId}`)
    return NextResponse.json({ barbershopId: barbershop.id })
  } catch (error) {
    logger.error("Error fetching barbershop:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
