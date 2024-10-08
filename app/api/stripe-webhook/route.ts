import { NextResponse } from "next/server"
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
      const userId = session.metadata?.userId
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
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripeSessionId: session.id,
      })
      await db.tempBarbershopId.create({
        data: {
          sessionId: session.id,
          barbershopId: newBarbershop.id,
        },
      })

      logger.log("Created new barbershop ID:", newBarbershop.id)

      await db.barbershopUser.create({
        data: {
          userId: userId,
          barbershopId: newBarbershop.id,
        },
      })

      logger.log("BarbershopUser created successfully")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-barbershop-id-by-session?session_id=${session.id}`,
      )
      const data = await response.json()
      logger.log(
        "Barbershop ID retrieved from new endpoint:",
        data.barbershopId,
      )

      return NextResponse.json({
        success: true,
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

  return NextResponse.json({ received: true }, { status: 200 })
}
