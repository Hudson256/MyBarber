"use client"

import { useState } from "react"
import { Button } from "@/app/_components/ui/button"
import RatingModal from "@/app/_components/rating-modal"
import { toast } from "sonner"
import { Barbershop, BarbershopService } from "@prisma/client"
import { useSession } from "next-auth/react" // Importa useSession para obter informações do usuário

interface RatingClientSideProps {
  barbershop: Barbershop & { services: BarbershopService[] }
}

const RatingClientSide: React.FC<RatingClientSideProps> = ({ barbershop }) => {
  const { data: session } = useSession() // Obtém dados da sessão do usuário
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleRatingSubmit = async (rating: {
    serviceId: string | null
    rating: number
    message: string
  }) => {
    try {
      // Adiciona o nome e o avatar do usuário à requisição
      const ratingData = {
        ...rating,
        userName: session?.user?.name || "Anonymous", // Nome do usuário
        userAvatar: session?.user?.image || "", // Avatar do usuário
      }

      const response = await fetch(`/barbershops/${barbershop.id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      })

      if (response.ok) {
        toast.success("Rating submitted successfully!")
        setIsModalOpen(false)
      } else {
        toast.error("Failed to submit rating")
      }
    } catch (error) {
      toast.error("An error occurred while submitting the rating")
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="my-4 flex justify-center">
      <Button variant="outline" onClick={() => setIsModalOpen(true)}>
        Avaliar
      </Button>

      {isModalOpen && (
        <RatingModal
          services={barbershop.services}
          onSubmit={handleRatingSubmit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default RatingClientSide