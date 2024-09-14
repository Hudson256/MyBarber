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
  const sig = req.headers.get("stripe-signature") as string

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

    // Adicione log para verificar o conteúdo da sessão
    logger.log("Session details:", JSON.stringify(session, null, 2))

    try {
      const customer = await stripe.customers.create({
        name: session.customer_details?.name || "Cliente Desconhecido",
        email: session.customer_details?.email || undefined,
      })

      const newBarbershop = await createBarbershop({
        name: "Nova Barbearia",
        address: "Endereço a ser definido",
        description: "Descrição a ser definida",
        imageUrl: "https://example.com/default-image.jpg",
        phones: [],
        stripeCustomerId: customer.id,
        stripeSubscriptionId: session.subscription as string,
        stripeSessionId: session.id,
      })
      logger.log("Barbershop created successfully:", newBarbershop.id)

      const userEmail = session.customer_details?.email
      if (userEmail) {
        const user = await db.user.findUnique({
          where: { email: userEmail },
        })

        if (user) {
          await db.barbershopUser.create({
            data: {
              userId: user.id,
              barbershopId: newBarbershop.id,
            },
          })
          logger.log("BarbershopUser created successfully")
        } else {
          logger.error("User not found for creating BarbershopUser")
        }
      }

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

  if (event.type === "customer.subscription.created") {
    // Lógica para quando uma assinatura é criada
  }

  if (event.type === "customer.subscription.trial_will_end") {
    const subscription = event.data.object as Stripe.Subscription
    logger.log("Trial period is ending for subscription:", subscription.id)

    const userEmail = subscription.metadata.userEmail
    if (userEmail) {
      logger.log(`Notifying user at ${userEmail} about trial ending.`)
    }
  }

  return NextResponse.json({ received: true })
}
