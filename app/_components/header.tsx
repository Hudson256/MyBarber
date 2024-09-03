import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MenuIcon, Scissors } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <Image alt="MyBarber Logo" src="/logo.png" height={100} width={100} />
        </Link>

        <div className="flex items-center space-x-2">
          <Link href="/quero-ser-barbearia">
            <Button variant="outline" className="hidden sm:flex">
              <Scissors className="mr-2 h-4 w-4" />
              Seja um parceiro
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </div>
      </CardContent>
    </Card>
  )
}

export default Header
