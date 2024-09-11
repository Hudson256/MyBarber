import { NextResponse } from "next/server";
import Stripe from "stripe";
import { logger } from "@/app/_lib/logger";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
export async function POST(request) {
    try {
        const { priceId } = await request.json();
        logger.log("Received priceId:", priceId);
        if (!priceId) {
            logger.error("Price ID is missing");
            return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
        }
        logger.log("Creating Stripe session...");
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/quero-ser-barbearia`,
            metadata: {
                priceId: priceId,
            },
        });
        logger.log("Stripe session created successfully:", session.id);
        return NextResponse.json({ sessionId: session.id });
    }
    catch (error) {
        logger.error("Detailed error in create-checkout-session:", error);
        return NextResponse.json({
            error: "Erro ao criar sessão de checkout",
            details: error.message,
        }, { status: 500 });
    }
}
