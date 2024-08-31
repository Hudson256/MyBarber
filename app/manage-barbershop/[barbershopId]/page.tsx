"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { addBarbershopTime } from "./../../_actions/add-barbershop-time"
import { removeBarbershopTime } from "./../../_actions/remove-barbershop-time"
import { getBarbershopTimes } from "./../../_actions/get-barbershop-times"
import { Button } from "./../../_components/ui/button"
import { Calendar } from "./../../_components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../_components/ui/dialog"
import { toast } from "sonner"
import { ptBR } from "date-fns/locale"
import { getAllBarbershopTimes } from "../../_actions/get-all-barbershop-times"

export default function ManageBarbershop() {
  const { data: session } = useSession()
  const router = useRouter()
  const { barbershopId } = useParams()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [newTime, setNewTime] = useState<string>("")
  const [allTimes, setAllTimes] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    if (typeof barbershopId === "string" && selectedDate) {
      const fetchTimes = async () => {
        try {
          const barbershopTimes = await getBarbershopTimes({
            barbershopId,
            date: selectedDate,
          })
          setAvailableTimes(barbershopTimes)

          // Buscar todos os horários possíveis para esta barbearia
          const allBarbershopTimes = await getAllBarbershopTimes(barbershopId)
          setAllTimes(allBarbershopTimes)
        } catch (error) {
          console.error("Erro ao buscar horários:", error)
          toast.error("Erro ao carregar horários. Tente novamente.")
        }
      }

      fetchTimes()
    }
  }, [session, barbershopId, router, selectedDate])

  const handleAddTime = async (time: string) => {
    if (selectedDate && typeof barbershopId === "string") {
      try {
        await addBarbershopTime({
          barbershopId,
          dayOfWeek: selectedDate.getDay(),
          time,
        })
        const updatedTimes = await getBarbershopTimes({
          barbershopId,
          date: selectedDate,
        })
        setAvailableTimes(updatedTimes)
        toast.success("Horário adicionado com sucesso!")
      } catch (error) {
        console.error("Erro ao adicionar horário:", error)
        toast.error("Erro ao adicionar horário. Tente novamente.")
      }
    }
  }

  const handleRemoveTime = async (time: string) => {
    if (typeof barbershopId === "string" && selectedDate) {
      try {
        await removeBarbershopTime({
          barbershopId,
          dayOfWeek: selectedDate.getDay(),
          time,
        })
        const updatedTimes = await getBarbershopTimes({
          barbershopId,
          date: selectedDate,
        })
        setAvailableTimes(updatedTimes)
        toast.success("Horário removido com sucesso!")
      } catch (error) {
        console.error("Erro ao remover horário:", error)
        toast.error("Erro ao remover horário. Tente novamente.")
      }
    }
  }

  const handleNewTimeAdd = async () => {
    if (newTime) {
      await handleAddTime(newTime)
      setNewTime("")
    }
  }

  return (
    <div className="p-5">
      <h1 className="mb-4 text-2xl font-bold">Gerenciar Horários</h1>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="mb-4"
        locale={ptBR}
      />

      {selectedDate && (
        <div>
          <h2 className="mb-2 text-xl">
            Horários para {selectedDate.toLocaleDateString("pt-BR")} (
            {
              [
                "Domingo",
                "Segunda",
                "Terça",
                "Quarta",
                "Quinta",
                "Sexta",
                "Sábado",
              ][selectedDate.getDay()]
            }
            )
          </h2>
          <ul className="mb-4 space-y-2">
            {allTimes.map((time) => (
              <li key={time} className="flex items-center justify-between">
                <span>{time}</span>
                {availableTimes.includes(time) ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveTime(time)}
                  >
                    Remover
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTime(time)}
                  >
                    Adicionar
                  </Button>
                )}
              </li>
            ))}
          </ul>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Adicionar Novo Horário</Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
              <h2 className="mb-4 text-lg font-semibold">
                Adicionar Novo Horário
              </h2>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="mb-4 w-full rounded border p-2"
              />
              <Button onClick={handleNewTimeAdd}>Adicionar</Button>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
