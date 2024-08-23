/* eslint-disable no-unused-vars */
"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { StarIcon } from "lucide-react"
import { BarbershopService } from "@prisma/client" // Importa o tipo correto

interface RatingModalProps {
  services: BarbershopService[]
  onSubmit: (rating: {
    serviceId: string | null
    rating: number
    message: string
  }) => void
  onClose: () => void
}

const RatingModal: React.FC<RatingModalProps> = ({
  services,
  onSubmit,
  onClose,
}) => {
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(5)
  const [message, setMessage] = useState<string>("")
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  const handleSubmit = () => {
    onSubmit({ serviceId, rating, message })
    toast.success("Avaliação enviada com sucesso!")
    onClose() // Fechar o modal após o envio
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md rounded bg-gray-900 p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-2xl text-white"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold text-white">
          Avalie sua Experiência
        </h2>
        <div className="my-4">
          <label className="block text-sm font-medium text-white">
            Selecione o serviço prestado (opcional)
          </label>
          <select
            value={serviceId ?? ""}
            onChange={(e) => setServiceId(e.target.value || null)}
            className="w-full rounded border bg-gray-800 p-2 text-white"
          >
            <option value="">Nenhum serviço específico</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-white">
            Dê sua Nota:
          </label>
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => {
              const starRating = index + 1
              return (
                <StarIcon
                  key={starRating}
                  size={24}
                  className={`cursor-pointer ${starRating <= (hoveredRating || rating) ? "text-yellow-500" : "text-white"} transition-colors`}
                  onMouseEnter={() => setHoveredRating(starRating)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => setRating(starRating)}
                />
              )
            })}
          </div>
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-white">
            Faça um comentário sobre sua experiência:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded border bg-gray-800 p-2 text-white"
            rows={4}
          />
        </div>
        <Button variant="outline" onClick={handleSubmit}>
          Enviar Avaliação
        </Button>
      </div>
    </div>
  )
}

export default RatingModal
