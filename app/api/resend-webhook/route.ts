import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import Iron from "@hapi/iron"
import { sendEmail } from "@/app/_lib/sendEmail"

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET

async function handleEmailSent(data: any) {
  await db.emailLog.create({
    data: {
      type: "sent",
      to: data.to,
      subject: data.subject,
      messageId: data.message_id,
    },
  })

  const subject = "E-mail enviado com sucesso"
  const text = `Seu e-mail para ${data.to} foi enviado com sucesso.`
  await sendEmail(data.to, subject, text)
}

async function handleEmailDelivered(data: any) {
  await db.emailLog.create({
    data: {
      type: "delivered",
      to: data.to,
      subject: data.subject,
      messageId: data.message_id,
    },
  })

  const subject = "E-mail entregue"
  const text = `Seu e-mail para ${data.to} foi entregue com sucesso.`
  await sendEmail(data.to, subject, text)
}

async function handleEmailBounced(data: any) {
  await db.emailLog.create({
    data: {
      type: "bounced",
      to: data.to,
      subject: data.subject,
      messageId: data.message_id,
      reason: data.reason,
    },
  })

  const subject = "E-mail não entregue"
  const text = `O e-mail para ${data.to} não pôde ser entregue. Motivo: ${data.reason}`
  await sendEmail(data.to, subject, text)
}

async function handleEmailComplained(data: any) {
  await db.emailLog.create({
    data: {
      type: "complained",
      to: data.to,
      subject: data.subject,
      messageId: data.message_id,
    },
  })

  const subject = "Reclamação recebida"
  const text = `Recebemos uma reclamação sobre o e-mail enviado para ${data.to}.`
  await sendEmail(data.to, subject, text)
}

export async function POST(req: Request) {
  const signature = req.headers.get("resend-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 401 })
  }

  const body = await req.text()

  try {
    const { timestamp, token } = JSON.parse(signature)
    const unsealed = await Iron.unseal(token, WEBHOOK_SECRET!, Iron.defaults)
    if (unsealed !== body || Date.now() - timestamp > 300000) {
      throw new Error("Invalid signature")
    }

    const data = JSON.parse(body)

    switch (data.type) {
      case "email.sent":
        await handleEmailSent(data.data)
        break
      case "email.delivered":
        await handleEmailDelivered(data.data)
        break
      case "email.bounced":
        await handleEmailBounced(data.data)
        break
      case "email.complained":
        await handleEmailComplained(data.data)
        break
      default:
        console.log(`Evento não tratado: ${data.type}`)
    }

    return NextResponse.json({ message: "Webhook processado com sucesso" })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 400 },
    )
  }
}
