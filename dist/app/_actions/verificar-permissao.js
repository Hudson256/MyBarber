export async function verificarPermissao(userId, barbershopId) {
    try {
        const response = await fetch("/api/verificar-permissao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, barbershopId }),
        });
        if (!response.ok) {
            throw new Error("Falha na requisição");
        }
        const data = await response.json();
        return data.temPermissao;
    }
    catch (error) {
        console.error("Erro ao verificar permissão:", error);
        throw new Error("Falha ao verificar permissão do usuário");
    }
}
