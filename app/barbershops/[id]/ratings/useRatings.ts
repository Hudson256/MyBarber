// /app/barbershops/[id]/ratings/useRatings.ts

import { useState, useEffect } from "react"
import { fetchServices, submitRating } from "./ratings-api"

export const useServices = (barbershopId: string) => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await fetchServices(barbershopId)
        setServices(services)
      } catch (err) {
        setError("Failed to load services")
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [barbershopId])

  return { services, loading, error }
}

export const useSubmitRating = (barbershopId: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (rating: {
    serviceId: string | null
    rating: number
    message: string
  }) => {
    setLoading(true)
    try {
      await submitRating(barbershopId, rating)
    } catch (err) {
      setError("Failed to submit rating")
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
