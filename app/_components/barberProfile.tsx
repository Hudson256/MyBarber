// components/BarberProfile.tsx

import { useState, useEffect } from "react"
import { Avatar, AvatarImage } from "./ui/avatar"
import { StarRating } from "./star-rating"

interface Barber {
  id: string
  name: string
  imageUrl: string
  description: string
}

interface Review {
  id: string
  rating: number
  comment: string
}

interface BarberProfileProps {
  barberId: string
}

export function BarberProfile({ barberId }: BarberProfileProps) {
  const [barber, setBarber] = useState<Barber | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    async function fetchBarberData() {
      try {
        const barberResponse = await fetch(`/api/barbers/${barberId}`)
        if (!barberResponse.ok) throw new Error("Failed to fetch barber data")
        const barberData = await barberResponse.json()
        setBarber(barberData)

        const reviewsResponse = await fetch(`/api/reviews?barberId=${barberId}`)
        if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews")
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching barber data:", error)
        // Você pode adicionar um estado de erro aqui e exibi-lo na UI
      }
    }
    fetchBarberData()
  }, [barberId])

  if (!barber) return <div>Carregando...</div>

  return (
    <div>
      <Avatar>
        <AvatarImage src={barber.imageUrl} alt={barber.name} />
      </Avatar>
      <h2>{barber.name}</h2>
      <p>{barber.description}</p>
      <h3>Avaliações</h3>
      {reviews.map((review) => (
        <div key={review.id}>
          <StarRating rating={review.rating} />
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
