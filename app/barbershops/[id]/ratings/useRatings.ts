// /app/barbershops/[id]/ratings/useRatings.ts

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitRating } from "./ratings-api"

interface Rating {
  serviceId: string | null
  barberId: string | null // Adicionado barberId
  rating: number
  message: string
}

export const useSubmitRating = (barbershopId: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmitRating = async (rating: Rating) => {
    setLoading(true)
    try {
      await submitRating(barbershopId, rating)
      router.refresh()
    } catch (err) {
      setError("Failed to submit rating")
    } finally {
      setLoading(false)
    }
  }

  return { handleSubmitRating, loading, error }
}
