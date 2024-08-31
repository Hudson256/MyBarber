"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Button } from "../../_components/ui/button"
import { Calendar } from "../../_components/ui/calendar"
import Header from "../../_components/header"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../../_components/ui/dialog"
import { toast } from "sonner"
import { ptBR } from "date-fns/locale"

export default function ManageBarbershop() {
  const { data: session } = useSession()
  const router = useRouter()
  const { barbershopId } = useParams()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [newTime, setNewTime] = useState<string>("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  const fetchTimes = useCallback(async () => {
    if (!barbershopId || !selectedDate) return

    try {
      console.log("Fetching times:", barbershopId, selectedDate)
      const response = await fetch(
        `/api/barbershop-times?barbershopId=${barbershopId}&date=${selectedDate.toISOString()}`,
      )
      if (!response.ok) throw new Error("Falha ao buscar horários")
      const data = await response.json()
      console.log("Received data:", data)

      const newTimes = Array.isArray(data.availableTimes)
        ? data.availableTimes
        : []
      // Ordenar os horários
      const sortedTimes = newTimes.sort((a: string, b: string) => {
        const [aHours, aMinutes] = a.split(":").map(Number)
        const [bHours, bMinutes] = b.split(":").map(Number)
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes)
      })
      setAvailableTimes(sortedTimes)
      console.log("Available times set:", sortedTimes)
    } catch (error) {
      console.error("Erro ao buscar horários:", error)
      toast.error("Erro ao carregar horários. Tente novamente.")
    }
  }, [barbershopId, selectedDate])

  const fetchAppointments = useCallback(async () => {
    if (!barbershopId || !selectedDate) return

    try {
      const response = await fetch(
        `/api/appointments?barbershopId=${barbershopId}&date=${selectedDate.toISOString()}`,
      )
      if (!response.ok) throw new Error("Falha ao buscar agendamentos")
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
      toast.error("Erro ao carregar agendamentos. Tente novamente.")
    }
  }, [barbershopId, selectedDate])

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    if (barbershopId && selectedDate) {
      fetchTimes()
      fetchAppointments()
    }
  }, [
    session,
    barbershopId,
    selectedDate,
    router,
    fetchTimes,
    fetchAppointments,
  ])

  const handleAddTime = async (time: string) => {
    try {
      const response = await fetch("/api/barbershop-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barbershopId,
          dayOfWeek: selectedDate?.getDay(),
          time,
        }),
      })
      if (!response.ok) throw new Error("Falha ao adicionar horário")
      await fetchTimes()
      toast.success("Horário adicionado com sucesso!")
    } catch (error) {
      console.error("Erro ao adicionar horário:", error)
      toast.error("Erro ao adicionar horário. Tente novamente.")
    }
  }

  const handleRemoveTime = async (time: string) => {
    try {
      const response = await fetch("/api/barbershop-times", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barbershopId,
          dayOfWeek: selectedDate?.getDay(),
          time,
        }),
      })
      if (!response.ok) throw new Error("Falha ao remover horário")
      await fetchTimes()
      toast.success("Horário removido com sucesso!")
    } catch (error) {
      console.error("Erro ao remover horário:", error)
      toast.error("Erro ao remover horário. Tente novamente.")
    }
  }

  const handleNewTimeAdd = async () => {
    if (newTime) {
      await handleAddTime(newTime)
      setNewTime("")
    }
  }

  return (
    <>
      <Header />
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
            {availableTimes.length > 0 ? (
              <ul className="mb-4 space-y-2">
                {availableTimes.map((time) => (
                  <li key={time} className="flex items-center justify-between">
                    <span>{time}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveTime(time)}
                    >
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum horário disponível para esta data.</p>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button>Adicionar Novo Horário</Button>
              </DialogTrigger>
              <DialogContent className="w-[90%]">
                <DialogTitle>Adicionar Novo Horário</DialogTitle>
                <DialogDescription>
                  Selecione um horário para adicionar à disponibilidade da
                  barbearia.
                </DialogDescription>
                <div className="mt-4">
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="mb-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button onClick={handleNewTimeAdd}>Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>

            <h2 className="mb-2 mt-8 text-xl">Agendamentos para este dia</h2>
            <ul className="space-y-2">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex flex-wrap items-center justify-between"
                >
                  <span>
                    {appointment.time} - {appointment.clientName} -{" "}
                    {appointment.serviceName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
