import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import Stripe from "stripe"
import { logger } from "@/app/_lib/logger"
import { createBarbershop } from "@/app/_actions/create-barbershop"
import { db } from "@/app/_lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    logger.error("Stripe signature is missing")
    return NextResponse.json(
      { error: "Stripe signature is required" },
      { status: 400 },
    )
  }

  logger.log("Received webhook body:", body)
  logger.log("Received signature:", sig)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    logger.error(`Webhook error: ${errorMessage}`)
    return NextResponse.json(
      { error: `Webhook error: ${errorMessage}` },
      { status: 400 },
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    logger.log("Checkout session completed:", session.id)

    try {
      const customerId = session.customer as string
      const userSession = await getServerSession() // Obtendo a sessão do NextAuth
      logger.log("User session:", userSession) // Log da sessão do usuário
      const userId = userSession?.user?.id

      if (!userId) {
        logger.error("User ID is missing for creating BarbershopUser")
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 },
        )
      }

      const newBarbershop = await createBarbershop({
        name: "Nova Barbearia",
        address: "Endereço a ser definido",
        description: "Descrição a ser definida",
        imageUrl: "https://example.com/default-image.jpg",
        phones: [],
        stripeCustomerId: customerId,
        stripeSubscriptionId: session.subscription as string,
        stripeSessionId: session.id,
      })

      logger.log("Barbershop created successfully:", newBarbershop.id)

      await db.barbershopUser.create({
        data: {
          userId: userId,
          barbershopId: newBarbershop.id,
        },
      })

      logger.log("BarbershopUser created successfully")

      await stripe.checkout.sessions.update(session.id, {
        metadata: { barbershopId: newBarbershop.id },
      })

      logger.log("Stripe session updated with barbershop ID")

      return NextResponse.json({
        received: true,
        barbershopId: newBarbershop.id,
      })
    } catch (error) {
      logger.error("Error creating barbershop or BarbershopUser:", error)
      return NextResponse.json(
        {
          error: "Failed to create barbershop or BarbershopUser",
          details: (error as Error).message,
        },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ received: true })
}
