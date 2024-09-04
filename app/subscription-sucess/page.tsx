import { useRouter } from "next/router"
import Header from "../_components/header"
import { Button } from "../_components/ui/button"

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const { id } = router.query

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
          <p className="mb-6 text-center text-lg text-gray-600 dark:text-gray-300">
            ID da sua barbearia: <span className="font-bold">{id}</span>
          </p>
          <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
            Você pode gerenciar sua barbearia e modificar suas informações na
            tela de gerenciamento.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => router.push(`/manage-barbershop/${id}`)}
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
