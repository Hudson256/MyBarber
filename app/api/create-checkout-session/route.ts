import { NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/app/_lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  try {
    const { priceId, customerId } = await request.json()
    logger.log("Received priceId:", priceId)

    if (!priceId || !customerId) {
      logger.error("Price ID or Customer ID is missing")
      return NextResponse.json(
        { error: "Price ID and Customer ID are required" },
        { status: 400 },
      )
    }

    logger.log("Creating Stripe subscription...")
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      trial_period_days: 14,
      metadata: {
        priceId: priceId,
      },
    })
    logger.log("Stripe subscription created successfully:", subscription.id)

    return NextResponse.json({ subscriptionId: subscription.id })
  } catch (error) {
    logger.error("Detailed error in create-checkout-session:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar assinatura",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
