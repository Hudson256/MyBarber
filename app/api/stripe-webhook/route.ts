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
    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido"
    logger.error(`Erro no webhook: ${errorMessage}`)
    return NextResponse.json(
      { error: `Erro no webhook: ${errorMessage}` },
      { status: 400 },
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    logger.log("Sessão de checkout completada:", session.id)

    try {
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
      logger.log("Barbearia criada com sucesso:", newBarbershop.id)
      await stripe.checkout.sessions.update(session.id, {
        metadata: { barbershopId: newBarbershop.id },
      })
      logger.log("Sessão do Stripe atualizada com o ID da barbearia")

      // Cria o BarbershopUser
      const user = session.customer_details?.email
        ? await db.user.findUnique({
            where: { email: session.customer_details.email },
          })
        : null

      if (user) {
        await db.barbershopUser.create({
          data: {
            userId: user.id,
            barbershopId: newBarbershop.id,
          },
        })
        logger.log("BarbershopUser criado com sucesso")
      } else {
        logger.error("Usuário não encontrado para criar BarbershopUser")
      }

      return NextResponse.json({
        received: true,
        barbershopId: newBarbershop.id,
      })
    } catch (error) {
      logger.error(
        "Erro detalhado ao criar barbearia ou BarbershopUser:",
        error,
      )
      return NextResponse.json(
        {
          error: "Falha ao criar barbearia ou BarbershopUser",
          details: (error as Error).message,
        },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ received: true })
}
