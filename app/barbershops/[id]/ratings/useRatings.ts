// /app/barbershops/[id]/ratings/useRatings.ts

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Rating {
  serviceId: string | null
  barberId: string | null // Adicionado barberId
  rating: number
  message: string
}

const submitRating = async (barbershopId: string, rating: Rating) => {
  const response = await fetch(`/api/barbershops/${barbershopId}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rating),
  })

  if (!response.ok) {
    throw new Error("Failed to submit rating")
  }

  return response.json()
}

export const useRatings = (barbershopId: string) => {
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
