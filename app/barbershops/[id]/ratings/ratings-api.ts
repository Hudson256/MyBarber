// /app/barbershops/[id]/ratings/ratings-api.ts

export const fetchServices = async (barbershopId: string) => {
  try {
    const response = await fetch(`/barbershops/${barbershopId}/services`)
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error("Failed to fetch services")
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const submitRating = async (
  barbershopId: string,
  rating: { serviceId: string | null; rating: number; message: string },
) => {
  try {
    const response = await fetch(`/barbershops/${barbershopId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rating),
    })

    if (response.ok) {
      return await response.json()
    } else {
      throw new Error("Failed to submit rating")
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
