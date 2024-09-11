import React from "react";
import { useRouter } from "next/router";
const SubscriptionSuccessScreen = ({ barbershopId, }) => {
    const router = useRouter();
    return (<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">
        Assinatura Concluída com Sucesso!
      </h1>
      <p className="mb-6 text-xl">ID da sua barbearia: {barbershopId}</p>
      <p className="mb-8">
        Você pode modificar suas informações na tela de gerenciamento.
      </p>
      <button onClick={() => router.push(`/manage/${barbershopId}`)} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">
        Ir para Gerenciamento
      </button>
    </div>);
};
export default SubscriptionSuccessScreen;
