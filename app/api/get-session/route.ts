import { NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/app/_lib/logger"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })
    logger.log("Stripe session retrieved successfully")

    const barbershop = await prisma.barbershop.findUnique({
      where: { stripeSessionId: sessionId },
      select: { id: true, name: true },
    })

    if (!barbershop) {
      throw new Error("Barbearia não encontrada")
    }

    const subscription = session.subscription as Stripe.Subscription
    const plan = subscription?.items?.data[0]?.price.nickname || "Plano padrão"
    return NextResponse.json({
      id: barbershop.id,
      name: barbershop.name,
      plan: plan,
    })
  } catch (error) {
    logger.error("Error fetching session details:", error)
    return NextResponse.json(
      { error: "Erro ao buscar detalhes da sessão" },
      { status: 500 },
    )
  }
}
