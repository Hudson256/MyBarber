"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { LogInIcon } from "lucide-react"
import SignInDialog from "./sign-in-dialog"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

export default function AssinaturaCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)
  const { data: session } = useSession()

  const handleSubscribe = async () => {
    if (!session || !session.user.email) {
      toast.error("Você precisa estar logado para assinar.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          customerEmail: session.user.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Falha ao criar sessão de checkout: ${errorData.error}`)
      }

      const { subscriptionId, checkoutUrl } = await response.json()
      setSubscriptionId(subscriptionId)

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Falha ao carregar o serviço de pagamento")
      }

      window.location.href = checkoutUrl
    } finally {
      setIsLoading(false)
    }
  }

  console.log("Subscription ID:", subscriptionId)

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
        {session ? (
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Processando..." : "Iniciar teste grátis"}
          </button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="default">
                <LogInIcon className="mr-2 h-4 w-4" />
                Faça login para assinar
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
              <SignInDialog />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
