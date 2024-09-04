"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "sonner"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

export default function AssinaturaCard() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      console.log("Iniciando processo de checkout...")
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error(
          "Resposta do servidor não ok:",
          response.status,
          errorData,
        )
        throw new Error(`Falha ao criar sessão de checkout: ${errorData.error}`)
      }

      const { sessionId, barbershopId } = await response.json()
      console.log("Session ID recebido:", sessionId)
      console.log("Barbershop ID recebido:", barbershopId)

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Falha ao carregar o serviço de pagamento")
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        console.error("Erro ao redirecionar para o checkout:", error)
        throw error
      }
    } catch (error) {
      console.error("Erro detalhado ao iniciar o checkout:", error)
      toast.error(
        "Ocorreu um erro ao iniciar o processo de pagamento. Por favor, tente novamente.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Assinatura Mensal
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Acesse todas as funcionalidades por apenas R$50/mês
      </p>
      <ul className="mb-6 space-y-2 text-gray-600 dark:text-gray-300">
        <li>✅ Sistema de agendamento online</li>
        <li>✅ Gerenciamento de clientes</li>
        <li>✅ Controle de estoque</li>
        <li>✅ Relatórios financeiros</li>
        <li>✅ Suporte técnico</li>
        <li>✅ 14 dias de teste grátis</li>
        <li>✅ Cancele a qualquer momento</li>
      </ul>
      <div className="mt-auto">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Ao se inscrever, você concorda com nossa cobrança recorrente de R$50
          por mês após o período de teste gratuito de 14 dias. Você pode
          cancelar a qualquer momento.
        </p>
        <p className="mb-4 text-sm text-yellow-600 dark:text-yellow-400">
          Nota: Se você estiver usando um bloqueador de anúncios, pode ser
          necessário desativá-lo temporariamente para concluir o processo de
          assinatura.
        </p>
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? "Processando..." : "Iniciar teste grátis"}
        </button>
      </div>
    </div>
  )
}
