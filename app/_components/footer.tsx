import Link from "next/link"
import { Card, CardContent } from "./ui/card"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="flex flex-col items-center px-5 py-6">
          <p className="text-sm text-gray-400">
            © 2024 Copyright <span className="font-bold">FSW Barber</span>
          </p>
          <div className="mt-4 flex space-x-4 text-sm text-gray-500">
            <Link href="/privacy-policy">Política de Privacidade</Link>
            <Link href="/terms-of-service">Termos de Serviço</Link>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
