import { NextResponse } from "next/server"
import { Resend } from "resend"
import { db } from "@/app/_lib/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, phone, joinPlatform, requestWebsite } =
      await req.json()

    console.log("Dados recebidos:", {
      name,
      email,
      phone,
      joinPlatform,
      requestWebsite,
    })
    console.log(
      "RESEND_API_KEY:",
      process.env.RESEND_API_KEY ? "Configurada" : "Não configurada",
    )

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não está configurada")
    }

    const { data, error } = await resend.emails.send({
      from: "My Barber <contato@mybarber.today>",
      to: "hudsono256@gmail.com",
      subject: "Nova solicitação de barbearia",
      html: `
        <h1>Nova solicitação de barbearia</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Quer fazer parte da plataforma:</strong> ${joinPlatform ? "Sim" : "Não"}</p>
        <p><strong>Quer orçamento para site próprio:</strong> ${requestWebsite ? "Sim" : "Não"}</p>
      `,
    })

    if (error) {
      console.error("Erro detalhado do Resend:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      throw new Error("Falha ao enviar e-mail: Nenhum dado retornado")
    }

    // Armazenar o messageId para rastreamento
    await db.emailLog.create({
      data: {
        type: "sent",
        to: "hudsono256@gmail.com",
        subject: "Nova solicitação de barbearia",
        messageId: data.id,
      },
    })

    return NextResponse.json({
      message: "E-mail enviado com sucesso",
      messageId: data.id,
    })
  } catch (error) {
    console.error("Erro detalhado ao processar a solicitação:", error)
    if (error instanceof Error) {
      console.error("Mensagem de erro:", error.message)
      console.error("Stack trace:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Erro ao processar a solicitação",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}