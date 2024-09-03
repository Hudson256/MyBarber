import { NextResponse } from "next/server"
import { Resend } from "resend"

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

    console.log("E-mail enviado com sucesso. ID:", data.id)

    // Temporarily remove email logging
    // TODO: Set up EmailLog table in the database schema

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
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
