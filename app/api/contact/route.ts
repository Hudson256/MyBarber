import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não está configurada")
    }

    const { data, error } = await resend.emails.send({
      from: "My Barber <contato@mybarber.today>",
      to: "hudsono256@gmail.com",
      subject: "Nova solicitação de orçamento para site próprio",
      html: `
        <h1>Nova solicitação de orçamento para site próprio</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      throw new Error("Falha ao enviar e-mail: Nenhum dado retornado")
    }

    return NextResponse.json({
      message: "Orçamento enviado com sucesso",
      messageId: data.id,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processar a solicitação",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
