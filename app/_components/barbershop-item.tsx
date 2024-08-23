"use client"

import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"
import Link from "next/link"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem: React.FC<BarbershopItemProps> = ({ barbershop }) => {
  return (
    <div>
      <Card className="min-w-[167px] rounded-2xl">
        <CardContent className="p-0 px-1 pt-1">
          <div className="relative h-[159px] w-full">
            <Image
              alt={barbershop.name}
              fill
              className="rounded-2xl object-cover"
              src={barbershop.imageUrl}
            />

            <Badge
              className="absolute left-2 top-2 space-x-1"
              variant="secondary"
            >
              <StarIcon size={12} className="fill-primary text-primary" />
              <p className="text-xs font-semibold">5.0</p>
            </Badge>
          </div>

          <div className="px-1 py-3">
            <h3 className="truncate font-semibold">{barbershop.name}</h3>
            <p className="truncate text-sm text-gray-400">
              {barbershop.address}
            </p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" className="w-full" asChild>
                <Link href={`/barbershops/${barbershop.id}`}>Reservar</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BarbershopItem
