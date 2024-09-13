import { NextResponse } from "next/server"
import Stripe from "stripe"
import { logger } from "@/app/_lib/logger"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  try {
    const { priceId, customerEmail } = await request.json()
    logger.log("Received priceId:", priceId)
    logger.log("Received customerEmail:", customerEmail)

    if (!priceId || !customerEmail) {
      logger.error("Price ID or Customer Email is missing")
      return NextResponse.json(
        { error: "Price ID and Customer Email are required" },
        { status: 400 },
      )
    }
    let customerId: string
    const customers = await stripe.customers.list({ email: customerEmail })

    if (customers.data.length > 0) {
      customerId = customers.data[0].id
      logger.log("Using existing customer ID:", customerId)
    } else {
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: "Customer created for subscription",
      })
      customerId = customer.id
      logger.log("Created new customer ID:", customerId)
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
