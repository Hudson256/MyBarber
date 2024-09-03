import { Metadata } from "next"
import Header from "../_components/header"
import BarbershopForm from "../_components/barbershop-form"

export const metadata: Metadata = {
  title: "Quero ser uma barbearia | My Barber",
  description: "Junte-se à plataforma My Barber e expanda seu negócio",
}

export default function QueroSerBarbearia() {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Quero ser uma barbearia</h1>
        <div className="mb-8 space-y-4">
          <p>
            Junte-se à plataforma My Barber e leve seu negócio ao próximo nível!
            Com nossa solução completa, você terá:
          </p>
          <ul className="list-disc pl-5">
            <li>Maior visibilidade para sua barbearia</li>
            <li>Sistema de agendamento online eficiente</li>
            <li>Gestão simplificada de clientes e serviços</li>
            <li>Aumento nas reservas e fidelização de clientes</li>
          </ul>
          <p>
            Por apenas R$50 por mês, você terá acesso a todas essas vantagens e
            muito mais. Não perca tempo, comece a transformar seu negócio hoje!
          </p>
        </div>
        <BarbershopForm />
      </div>
    </div>
  )
}
