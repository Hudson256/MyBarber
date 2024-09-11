import Header from "../_components/header";
import AssinaturaCard from "../_components/assinatura-card";
import OrcamentoCard from "../_components/orcamento-card";
export const metadata = {
    title: "Quero ser uma barbearia | My Barber",
    description: "Junte-se à plataforma My Barber e expanda seu negócio",
};
export default function QueroSerBarbearia() {
    return (<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-gray-100">
          Quero ser uma barbearia
        </h1>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            Junte-se à plataforma My Barber e leve seu negócio ao próximo nível!
            Com nossa solução completa, você terá:
          </p>
          <ul className="mb-6 space-y-2 text-center text-gray-700 dark:text-gray-200">
            <li>✅ Maior visibilidade para sua barbearia</li>
            <li>✅ Sistema de agendamento online eficiente</li>
            <li>✅ Gestão simplificada de clientes e serviços</li>
            <li>✅ Aumento nas reservas e fidelização de clientes</li>
          </ul>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <AssinaturaCard />
          <OrcamentoCard />
        </div>
      </div>
    </div>);
}
