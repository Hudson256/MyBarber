"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/app/_components/ui/button"
import { Calendar } from "@/app/_components/ui/calendar"
import Header from "@/app/_components/header"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/app/_components/ui/dialog"
import { Input } from "@/app/_components/ui/input"
import { Textarea } from "@/app/_components/ui/textarea"
import { toast } from "sonner"
import { ptBR } from "date-fns/locale"
import { format, parseISO, setHours, setMinutes } from "date-fns"

interface Barber {
  id: string
  name: string
  description: string
}

export default function ManageBarbershopContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const { barbershopId } = useParams()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [newTime, setNewTime] = useState<string>("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [newBarber, setNewBarber] = useState({ name: "", description: "" })

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
      setAvailableTimes(newTimes)
      console.log("Available times set:", newTimes)
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

  const fetchBarbers = useCallback(async () => {
    if (!barbershopId) return

    try {
      const response = await fetch(`/api/barbers?barbershopId=${barbershopId}`)
      if (!response.ok) throw new Error("Falha ao buscar barbeiros")
      const data = await response.json()
      setBarbers(data)
    } catch (error) {
      console.error("Erro ao buscar barbeiros:", error)
      toast.error("Erro ao carregar barbeiros. Tente novamente.")
    }
  }, [barbershopId])

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

  useEffect(() => {
    if (barbershopId) {
      fetchBarbers()
    }
  }, [barbershopId, fetchBarbers])

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

  const handleAddBarber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBarber, barbershopId }),
      })
      if (!response.ok) throw new Error("Falha ao adicionar barbeiro")
      setNewBarber({ name: "", description: "" })
      fetchBarbers()
      toast.success("Barbeiro adicionado com sucesso!")
    } catch (error) {
      console.error("Erro ao adicionar barbeiro:", error)
      toast.error("Erro ao adicionar barbeiro. Tente novamente.")
    }
  }

  const handleRemoveBarber = async (barberId: string) => {
    try {
      const response = await fetch(`/api/barbers/${barberId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Falha ao remover barbeiro")
      fetchBarbers()
      toast.success("Barbeiro removido com sucesso!")
    } catch (error) {
      console.error("Erro ao remover barbeiro:", error)
      toast.error("Erro ao remover barbeiro. Tente novamente.")
    }
  }

  // Função para ordenar horários
  const sortTimes = (times: string[]) => {
    return times.sort((a, b) => {
      const [aHours, aMinutes] = a.split(":").map(Number)
      const [bHours, bMinutes] = b.split(":").map(Number)
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes)
    })
  }

  // Função para ordenar agendamentos
  const sortAppointments = (appointments: any[]) => {
    return appointments.sort((a, b) => {
      const dateA = parseISO(a.date)
      const dateB = parseISO(b.date)
      const [hoursA, minutesA] = a.time.split(":").map(Number)
      const [hoursB, minutesB] = b.time.split(":").map(Number)

      const dateTimeA = setMinutes(setHours(dateA, hoursA), minutesA)
      const dateTimeB = setMinutes(setHours(dateB, hoursB), minutesB)

      return dateTimeA.getTime() - dateTimeB.getTime()
    })
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-5">
        <h1 className="mb-4 text-2xl font-bold">Gerenciar Barbearia</h1>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-1/2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={ptBR}
            />
          </div>

          <div className="w-full md:w-1/2">
            {selectedDate && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">
                  Horários para{" "}
                  {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </h2>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {sortTimes(availableTimes).map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="group relative text-sm transition-colors hover:bg-red-100"
                      onClick={() => handleRemoveTime(time)}
                    >
                      {time}
                      <span className="ml-2 font-bold text-red-500">×</span>
                      <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Remover
                      </span>
                    </Button>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Adicionar Novo Horário</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>Adicionar Novo Horário</DialogTitle>
                    <DialogDescription>
                      Selecione um horário para adicionar à disponibilidade da
                      barbearia.
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-background p-2 text-foreground dark:border-gray-700"
                      />
                      <Button onClick={handleNewTimeAdd}>Adicionar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Agendamentos</h2>
          <div className="space-y-4">
            {sortAppointments(appointments).map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-md border p-4 shadow-sm"
              >
                <p className="font-semibold">
                  {format(parseISO(appointment.date), "dd/MM/yyyy")} às{" "}
                  {appointment.time}
                </p>
                <p>Cliente: {appointment.clientName}</p>
                <p>Serviço: {appointment.serviceName}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-200">
            Gerenciar Barbeiros
          </h2>
          <ul className="mb-4 space-y-2">
            {barbers.map((barber) => (
              <li
                key={barber.id}
                className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-800 p-3"
              >
                <div>
                  <span className="font-medium text-gray-100">
                    {barber.name}
                  </span>
                  <p className="text-sm text-gray-400">{barber.description}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveBarber(barber.id)}
                  className="bg-red-900 text-gray-100 hover:bg-red-800"
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddBarber} className="space-y-2">
            <Input
              value={newBarber.name}
              onChange={(e) =>
                setNewBarber({ ...newBarber, name: e.target.value })
              }
              placeholder="Nome do barbeiro"
            />
            <Textarea
              value={newBarber.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewBarber({ ...newBarber, description: e.target.value })
              }
              placeholder="Descrição"
            />
            <Button type="submit">Adicionar Barbeiro</Button>
          </form>
        </div>
      </div>
    </>
  )
}
