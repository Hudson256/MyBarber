/* eslint-disable no-unused-vars */
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { StarIcon } from "lucide-react"
import { BarbershopService } from "@prisma/client"
import { fetchBarbers } from "../barbershops/[id]/ratings/ratings-api"

interface Barber {
  id: string
  name: string
}

interface RatingModalProps {
  services: BarbershopService[]
  barbershopId: string | undefined
  onSubmit: (rating: {
    serviceId: string | null
    barberId: string | null
    rating: number
    message: string
  }) => void
  onClose: () => void
  isDisabled?: boolean
}

const RatingModal: React.FC<RatingModalProps> = ({
  services,
  barbershopId,
  onSubmit,
  onClose,
  isDisabled = false,
}) => {
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [barberId, setBarberId] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(5)
  const [message, setMessage] = useState<string>("")
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(true)

  useEffect(() => {
    const loadBarbers = async () => {
      if (!barbershopId) {
        setIsLoadingBarbers(false)
        return
      }

      setIsLoadingBarbers(true)
      try {
        const data = await fetchBarbers(barbershopId)
        setBarbers(data)
      } catch (error) {
        console.error("Erro ao buscar barbeiros:", error)
        toast.error("Erro ao carregar barbeiros. Tente novamente.")
      } finally {
        setIsLoadingBarbers(false)
      }
    }

    loadBarbers()
  }, [barbershopId])

  const handleSubmit = () => {
    if (!barbershopId) {
      toast.error(
        "Não foi possível enviar a avaliação. Tente novamente mais tarde.",
      )
      return
    }
    onSubmit({ serviceId, barberId, rating, message })
    toast.success("Avaliação enviada com sucesso!")
    onClose()
  }

  if (isDisabled) {
    return null
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
            Selecione o barbeiro (opcional)
          </label>
          <select
            value={barberId ?? ""}
            onChange={(e) => setBarberId(e.target.value || null)}
            className="w-full rounded border bg-gray-800 p-2 text-white"
            disabled={isLoadingBarbers}
          >
            <option value="">
              {isLoadingBarbers
                ? "Carregando barbeiros..."
                : "Nenhum barbeiro específico"}
            </option>
            {!isLoadingBarbers &&
              barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
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
