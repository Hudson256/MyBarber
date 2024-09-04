import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

export default function AssinaturaCard() {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error("Falha ao carregar Stripe")

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "seu_price_id_do_stripe",
        }),
      })

      const session = await response.json()

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        console.error(result.error.message)
      }
    } catch (error) {
      console.error("Erro ao iniciar o checkout:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Assinatura Mensal</h2>
      <p className="mb-4">
        Acesse todas as funcionalidades por apenas R$50/mês
      </p>
      <ul className="mb-6 space-y-2">
        <li>✅ 14 dias de teste grátis</li>
        <li>✅ Cobrança recorrente a cada 30 dias</li>
        <li>✅ Cancele a qualquer momento</li>
      </ul>
      <p className="mb-4 text-sm text-gray-600">
        Ao se inscrever, você concorda com nossa cobrança recorrente de R$50 por
        mês após o período de teste gratuito de 14 dias. Você pode cancelar a
        qualquer momento.
      </p>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loading ? "Processando..." : "Iniciar teste grátis"}
      </button>
    </div>
  )
}
