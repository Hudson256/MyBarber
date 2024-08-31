import Link from "next/link"
import { Button } from "./ui/button"

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="mb-4 text-4xl font-bold">Acesso Não Autorizado</h1>
      <p className="mb-8 text-center">
        Você não tem permissão para acessar esta página.
      </p>
      <Link href="/">
        <Button>Sair</Button>
      </Link>
    </div>
  )
}
