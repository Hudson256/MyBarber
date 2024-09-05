"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "../_components/header"
import { Button } from "../_components/ui/button"
import { useRouter } from "next/navigation"

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [barbershopId, setBarbershopId] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      fetch(`/api/get-barbershop-id?session_id=${sessionId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Falha ao obter o ID da barbearia")
          }
          return response.json()
        })
        .then((data) => {
          setBarbershopId(data.barbershopId)
        })
        .catch((error) => {
          console.error("Erro ao buscar o ID da barbearia:", error)
        })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-gray-100">
          Assinatura Concluída com Sucesso!
        </h1>
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <p className="mb-6 text-center text-xl text-gray-600 dark:text-gray-300">
            Parabéns! Sua barbearia agora faz parte da plataforma My Barber.
          </p>
          {barbershopId && (
            <>
              <p className="mb-4 text-center text-lg text-gray-600 dark:text-gray-300">
                ID da sua barbearia:{" "}
                <span className="font-bold">{barbershopId}</span>
              </p>
              <div className="mb-6 rounded-lg bg-yellow-100 p-4 text-yellow-700">
                <p className="font-bold">Atenção:</p>
                <p>
                  Guarde este ID em um local seguro. Você precisará dele para
                  acessar e gerenciar sua barbearia no futuro.
                </p>
              </div>
            </>
          )}
          <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
            Você pode gerenciar sua barbearia e modificar suas informações na
            tela de gerenciamento.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() =>
                barbershopId &&
                router.push(`/manage-barbershop/${barbershopId}`)
              }
              className="hover:bg-primary-dark bg-primary text-white"
            >
              Ir para Gerenciamento
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
