/* eslint-disable @next/next/no-img-element */
import React from "react"
import { StarIcon } from "lucide-react"
import { BarbershopService } from "@prisma/client"

interface Rating {
  userName: string
  userAvatar: string | null
  serviceId: string
  rating: number
  message: string | null
  barberName?: string // Adicionado nome do barbeiro
}

interface RatingDisplayProps {
  ratings: Rating[]
  services: BarbershopService[]
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

  // Calcular a média das avaliações
  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0)
    return (totalRating / ratings.length).toFixed(1) // Mantém uma casa decimal
  }

  // Obter o número total de avaliações
  const totalRatings = ratings.length

  return (
    <div className="space-y-4 p-5">
      <div className="mb-4 flex items-center gap-2">
        <StarIcon className="fill-primary text-primary" size={24} />
        <p className="text-xl font-bold">
          {calculateAverageRating()} ({totalRatings} avaliações)
        </p>
      </div>

      {ratings.map((rating, index) => {
        const service = findService(rating.serviceId)

        return (
          <div
            key={`${rating.userName}-${index}`}
            className="flex rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="mr-4 flex-shrink-0">
              <img
                src={rating.userAvatar || "/default-avatar.png"} // Caminho corrigido
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
                  {rating.barberName && (
                    <p className="text-sm text-gray-500">
                      Barbeiro: {rating.barberName}
                    </p>
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
