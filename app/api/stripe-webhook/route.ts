import { NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/app/_lib/prisma"
import { logger } from "@/app/_lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    logger.log("Webhook event received:", event.type)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    logger.error(`Webhook Error: ${errorMessage}`)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    logger.log("Checkout session completed:", session.id)

    try {
      // Criar uma nova barbearia
      const newBarbershop = await db.barbershop.create({
        data: {
          name: "Nova Barbearia",
          address: "Endereço a ser definido",
          description: "Descrição a ser definida",
          imageUrl:
            "https://pixabay.com/get/gc53748efcc4f5ee16c71ded0d36370e61c27cfa97a50adbfd734e553959a71a450ff73641767018b40271af8a1e0a513033355c5c0835cc050a93215ba611551_1280.jpg",
          phones: [],
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          stripeSessionId: session.id,
        },
      })

      logger.log("New barbershop created:", newBarbershop.id)
      logger.log("Barbershop created successfully with session ID")
    } catch (error) {
      logger.error("Error creating barbershop:", error)
    }
  }

  return NextResponse.json({ received: true })
}
