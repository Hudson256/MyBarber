import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { logger } from "@/app/_lib/logger"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  logger.log("Received request for barbershop ID using session ID:", sessionId)

  if (!sessionId || typeof sessionId !== "string") {
    logger.error("Invalid or missing session ID")
    return NextResponse.json(
      { error: "Session ID is required and must be a string" },
      { status: 400 },
    )
  }

  try {
    const tempBarbershop = await db.tempBarbershopId.findUnique({
      where: {
        sessionId: sessionId,
      },
    })

    if (!tempBarbershop) {
      logger.error(`Barbershop not found for session ID: ${sessionId}`)
      return NextResponse.json(
        { error: "Barbershop not found" },
        { status: 404 },
      )
    }

    logger.log(`Barbershop found for session ID: ${sessionId}`)
    return NextResponse.json({ barbershopId: tempBarbershop.barbershopId })
  } catch (error) {
    logger.error("Error fetching barbershop:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
