import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import Iron from "@hapi/iron";
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;
async function handleEmailSent(data) {
    await db.emailLog.create({
        data: {
            type: "sent",
            to: data.to,
            subject: data.subject,
            messageId: data.message_id,
        },
    });
}
async function handleEmailDelivered(data) {
    await db.emailLog.create({
        data: {
            type: "delivered",
            to: data.to,
            subject: data.subject,
            messageId: data.message_id,
        },
    });
}
async function handleEmailBounced(data) {
    await db.emailLog.create({
        data: {
            type: "bounced",
            to: data.to,
            subject: data.subject,
            messageId: data.message_id,
            reason: data.reason,
        },
    });
}
async function handleEmailComplained(data) {
    await db.emailLog.create({
        data: {
            type: "complained",
            to: data.to,
            subject: data.subject,
            messageId: data.message_id,
        },
    });
}
export async function POST(req) {
    const signature = req.headers.get("resend-signature");
    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 401 });
    }
    const body = await req.text();
    try {
        // Verificar a assinatura
        const { timestamp, token } = JSON.parse(signature);
        const unsealed = await Iron.unseal(token, WEBHOOK_SECRET, Iron.defaults);
        if (unsealed !== body || Date.now() - timestamp > 300000) {
            throw new Error("Invalid signature");
        }
        const data = JSON.parse(body);
        switch (data.type) {
            case "email.sent":
                await handleEmailSent(data.data);
                break;
            case "email.delivered":
                await handleEmailDelivered(data.data);
                break;
            case "email.bounced":
                await handleEmailBounced(data.data);
                break;
            case "email.complained":
                await handleEmailComplained(data.data);
                break;
            default:
                console.log(`Evento não tratado: ${data.type}`);
        }
        return NextResponse.json({ message: "Webhook processado com sucesso" });
    }
    catch (error) {
        console.error("Erro ao processar webhook:", error);
        return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 400 });
    }
}
