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
} from "./../../_components/ui/dialog"

interface Time {
  id: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export default function ManageBarbershop() {
  const { data: session } = useSession()
  const router = useRouter()
  const { barbershopId } = useParams()
  const [times, setTimes] = useState<Time[]>([])
  const [newDate, setNewDate] = useState<Date | null>(null)

  useEffect(() => {
    // Check session status and redirect if not logged in
    if (!session) {
      router.push("/login")
      return
    }

    // Fetch barbershop times if the session is valid and barbershopId is available
    if (typeof barbershopId === "string") {
      const fetchTimes = async () => {
        const barbershopTimes = await getBarbershopTimes({
          barbershopId,
        })
        setTimes(barbershopTimes)
      }

      fetchTimes()
    }
  }, [session, barbershopId, router])

  // Handle adding new times
  const handleAddTime = async (dates: Date[] | undefined) => {
    if (dates && typeof barbershopId === "string") {
      for (const date of dates) {
        await addBarbershopTime({
          barbershopId,
          time: date.toISOString(),
        })
      }
      const updatedTimes = await getBarbershopTimes({ barbershopId })
      setTimes(updatedTimes)
    }
  }

  // Handle removing a specific time
  const handleRemoveTime = async (id: string) => {
    if (typeof barbershopId === "string") {
      await removeBarbershopTime({ bookingId: id })
      const updatedTimes = await getBarbershopTimes({ barbershopId })
      setTimes(updatedTimes)
    }
  }

  // Handle date input change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDate(new Date(event.target.value))
  }

  // Handle submitting a new date
  const handleSubmitDate = async () => {
    if (newDate && typeof barbershopId === "string") {
      await handleAddTime([newDate])
      setNewDate(null)
    }
  }

  return (
    <div>
      <h1>Gerenciar Horários</h1>
      <Calendar mode="multiple" onSelect={(dates) => handleAddTime(dates)} />

      <ul>
        {times.map((time) => (
          <li key={time.id}>
            <p>{new Date(time.date).toLocaleString()}</p>
            <Button onClick={() => handleRemoveTime(time.id)}>Remover</Button>
          </li>
        ))}
      </ul>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon">Adicionar Horário</Button>
        </DialogTrigger>
        <DialogContent className="w-[90%]">
          <h2 className="text-lg font-semibold">Adicionar Novo Horário</h2>
          <input
            type="datetime-local"
            onChange={handleDateChange}
            className="mt-2 w-full rounded border p-2"
          />
          <Button onClick={handleSubmitDate} className="mt-4">
            Adicionar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
