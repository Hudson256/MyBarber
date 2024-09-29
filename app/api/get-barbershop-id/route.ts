import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { logger } from "@/app/_lib/logger"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const barbershopId = searchParams.get("id")

  logger.log("Received request for barbershop ID:", barbershopId)

  if (!barbershopId || typeof barbershopId !== "string") {
    logger.error("Invalid or missing barbershop ID")
    return NextResponse.json(
      { error: "Barbershop ID is required and must be a string" },
      { status: 400 },
    )
  }

  try {
    const barbershop = await db.barbershop.findUnique({
      where: {
        id: barbershopId,
      },
    })

    logger.log("Database query result:", barbershop)

    if (!barbershop) {
      logger.error(`Barbershop not found for ID: ${barbershopId}`)
      return NextResponse.json(
        { error: "Barbershop not found" },
        { status: 404 },
      )
    }

    logger.log(`Barbershop found for ID: ${barbershopId}`)
    return NextResponse.json({ barbershopId: barbershop.id })
  } catch (error) {
    logger.error("Error fetching barbershop:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
