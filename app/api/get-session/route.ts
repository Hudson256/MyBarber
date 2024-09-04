import { NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/app/_lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    logger.error("Session ID is missing")
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    )
  }

  try {
    logger.log("Retrieving Stripe session:", sessionId)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    logger.log("Stripe session retrieved successfully")
    return NextResponse.json({ barbershopId: session.metadata?.barbershopId })
  } catch (error) {
    logger.error("Error fetching session details:", error)
    return NextResponse.json(
      { error: "Erro ao buscar detalhes da sessão" },
      { status: 500 },
    )
  }
}
