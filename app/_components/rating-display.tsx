/* eslint-disable @next/next/no-img-element */
import React from "react"
import { StarIcon } from "lucide-react"
import { BarbershopService } from "@prisma/client"

interface Rating {
  userName: string
  userAvatar: string | null // Adicionado null para o caso de não ter avatar
  serviceId: string
  rating: number
  message: string | null // Tornado opcional
}

interface RatingDisplayProps {
  ratings: Rating[] // Aceitando um array de avaliações
  services: BarbershopService[] // Aceitando um array de serviços
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ ratings, services }) => {
  const findService = (serviceId: string) => {
    return services.find((service) => service.id === serviceId) || null
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-5 w-5 ${i <= rating ? "text-yellow-500" : "text-gray-300"}`}
        />,
      )
    }
    return stars
  }

  return (
    <div className="space-y-4 p-5">
      {ratings.map((rating) => {
        const service = findService(rating.serviceId)

        return (
          <div
            key={rating.userName}
            className="flex rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="mr-4 flex-shrink-0">
              <img
                src={rating.userAvatar || "./ui/avatar.svg"} // Caminho corrigido
                alt={`${rating.userName}'s avatar`}
                className="h-12 w-12 rounded-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{rating.userName}</p>
                  {service && (
                    <p className="text-sm text-gray-500">{service.name}</p>
                  )}
                </div>
                <div className="flex items-center">
                  {renderStars(rating.rating)}
                </div>
              </div>
              <p className="mt-2 text-gray-700">{rating.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RatingDisplay
