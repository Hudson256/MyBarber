"use client";
import { useState } from "react";
import Header from "../_components/header";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { toast } from "sonner";
import { verificarPermissao } from "../_actions/verificar-permissao";
export default function EntrarBarbearia() {
    const [barbershopId, setBarbershopId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user?.id) {
            toast.error("Você precisa estar logado para acessar esta página.");
            router.push("/login");
            return;
        }
        setIsLoading(true);
        try {
            console.log(`Tentando verificar permissão para userId: ${session.user.id}, barbershopId: ${barbershopId}`);
            const temPermissao = await verificarPermissao(session.user.id, barbershopId);
            console.log(`Resultado da verificação de permissão:`, temPermissao);
            if (temPermissao) {
                router.push(`/manage-barbershop/${barbershopId}`);
            }
            else {
                toast.error("Você não tem permissão para gerenciar esta barbearia.");
            }
        }
        catch (error) {
            console.error("Erro detalhado ao verificar permissão:", error);
            if (error instanceof Error) {
                console.error("Mensagem de erro:", error.message);
                console.error("Stack trace:", error.stack);
            }
            toast.error("Erro ao verificar permissão. Tente novamente.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<>
      <Header />
      <div className="p-5">
        <h1 className="mb-4 text-2xl font-bold">Gerenciar Barbearia</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" value={barbershopId} onChange={(e) => setBarbershopId(e.target.value)} placeholder="Digite o ID da barbearia" required/>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </>);
}
