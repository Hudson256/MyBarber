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
import {
  addService,
  updateService,
  deleteService,
} from "@/app/_actions/service-actions"
import { FaWhatsapp } from "react-icons/fa"

interface Barber {
  id: string
  name: string
  description: string
}

interface Appointment {
  id: string
  date: string
  time: string
  clientName: string
  serviceName: string
  barberName: string
  phoneNumber?: string
}

interface Service {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
}

export default function ManageBarbershopContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const { barbershopId } = useParams()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [newTime, setNewTime] = useState<string>("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [newBarber, setNewBarber] = useState({ name: "", description: "" })
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
  })
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null)

  const fetchTimes = useCallback(async () => {
    if (!barbershopId || !selectedDate || !selectedBarberId) return

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0] // Formato YYYY-MM-DD
      const response = await fetch(
        `/api/barbershop-times?barbershopId=${barbershopId}&date=${formattedDate}&barberId=${selectedBarberId}`,
      )
      if (!response.ok) throw new Error("Falha ao buscar horários")
      const data = await response.json()

      const newTimes = Array.isArray(data.availableTimes)
        ? data.availableTimes
        : []
      setAvailableTimes(newTimes)
    } catch (error) {
      console.error("Erro ao buscar horários:", error)
      toast.error("Erro ao carregar horários. Tente novamente.")
    }
  }, [barbershopId, selectedDate, selectedBarberId])

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

  const fetchServices = useCallback(async () => {
    if (!barbershopId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/services?barbershopId=${barbershopId}`)
      if (!response.ok) throw new Error("Falha ao buscar serviços")
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
      toast.error("Erro ao carregar serviços. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }, [barbershopId])

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    if (barbershopId && selectedDate && selectedBarberId) {
      fetchTimes()
      fetchAppointments()
    }
  }, [
    session,
    barbershopId,
    selectedDate,
    selectedBarberId,
    router,
    fetchTimes,
    fetchAppointments,
  ])

  useEffect(() => {
    if (barbershopId) {
      fetchBarbers()
      fetchServices()
    }
  }, [barbershopId, fetchBarbers, fetchServices])

  const handleAddTime = async (time: string) => {
    try {
      const response = await fetch("/api/barbershop-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barbershopId,
          barberId: selectedBarberId,
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
          barberId: selectedBarberId,
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
      const response = await fetch(`/api/barbers?barberId=${barberId}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao remover barbeiro")
      }

      fetchBarbers()
      toast.success("Barbeiro removido com sucesso!")
    } catch (error) {
      console.error("Erro detalhado ao remover barbeiro:", error)
      toast.error(`Erro ao remover barbeiro: ${(error as Error).message}`)
    }
  }

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await addService({
        ...newService,
        price: parseFloat(newService.price),
        barbershopId: barbershopId as string,
      })
      setNewService({ name: "", description: "", imageUrl: "", price: "" })
      fetchServices()
      toast.success("Serviço adicionado com sucesso!")
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error)
      toast.error("Erro ao adicionar serviço. Tente novamente.")
    }
  }

  const handleUpdateService = async (
    serviceId: string,
    updatedData: Partial<Service>,
  ) => {
    try {
      await updateService(serviceId, updatedData)
      fetchServices()
      setEditingService(null)
      toast.success("Serviço atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error)
      toast.error("Erro ao atualizar serviço. Tente novamente.")
    }
  }

  const handleRemoveService = async (serviceId: string) => {
    try {
      await deleteService(serviceId)
      fetchServices()
      toast.success("Serviço removido com sucesso!")
    } catch (error) {
      console.error("Erro ao remover serviço:", error)
      toast.error("Erro ao remover serviço. Tente novamente.")
    }
  }

  const sortTimes = (times: string[]) => {
    return times.sort((a, b) => {
      const [aHours, aMinutes] = a.split(":").map(Number)
      const [bHours, bMinutes] = b.split(":").map(Number)
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes)
    })
  }

  const sortAppointments = (appointments: Appointment[]) => {
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

  const handleWhatsAppClick = (phoneNumber: string) => {
    const formattedNumber = phoneNumber.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/55${formattedNumber}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      <Header />
      <div className="container mx-auto bg-gray-900 p-5 text-gray-100">
        <h1 className="mb-4 text-2xl font-bold text-primary">
          Gerenciar Barbearia
        </h1>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full md:w-1/3">
                <h2 className="mb-2 text-xl font-semibold text-gray-200">
                  Selecione um barbeiro
                </h2>
                <select
                  value={selectedBarberId || ""}
                  onChange={(e) => setSelectedBarberId(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-100"
                >
                  <option value="">Selecione um barbeiro</option>
                  {barbers.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBarberId && (
                <div className="w-full md:w-2/3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-gray-700 bg-gray-800"
                    locale={ptBR}
                  />
                </div>
              )}
            </div>

            {selectedBarberId && selectedDate && (
              <div className="mt-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-200">
                  Horários para{" "}
                  {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </h2>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {sortTimes(availableTimes).map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="group relative bg-gray-800 text-sm text-gray-300 transition-colors hover:bg-red-900 hover:text-gray-100"
                      onClick={() => handleRemoveTime(time)}
                    >
                      {time}
                      <span className="ml-2 font-bold text-red-500">×</span>
                      <span className="absolute inset-0 flex items-center justify-center bg-red-800 text-gray-100 opacity-0 transition-opacity group-hover:opacity-100">
                        Remover
                      </span>
                    </Button>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="hover:bg-primary-dark w-full bg-primary text-gray-900">
                      Adicionar Novo Horário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-gray-100 sm:max-w-[425px]">
                    <DialogTitle className="text-primary">
                      Adicionar Novo Horário
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Selecione um horário para adicionar à disponibilidade do
                      barbeiro.
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-gray-900 p-2 text-gray-100"
                      />
                      <Button
                        onClick={handleNewTimeAdd}
                        className="hover:bg-primary-dark bg-primary text-gray-900"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-200">
                Agendamentos
              </h2>
              {isLoading ? (
                <p className="text-gray-400">Carregando agendamentos...</p>
              ) : !selectedDate ? (
                <p className="text-gray-400">
                  Selecione uma data para ver os agendamentos.
                </p>
              ) : appointments.length === 0 ? (
                <p className="text-gray-400">
                  Não há agendamentos para esta data.
                </p>
              ) : (
                <div className="space-y-4">
                  {sortAppointments(appointments).map(
                    (appointment: Appointment) => (
                      <div
                        key={appointment.id}
                        className="rounded-md border border-gray-700 bg-gray-800 p-4 shadow-sm"
                      >
                        <p className="font-semibold text-gray-200">
                          {format(parseISO(appointment.date), "dd/MM/yyyy")} às{" "}
                          {appointment.time}
                        </p>
                        <p className="text-gray-300">
                          Cliente: {appointment.clientName}
                        </p>
                        {appointment.phoneNumber ? (
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-300">
                              Telefone: {appointment.phoneNumber}
                            </p>
                            <button
                              onClick={() =>
                                handleWhatsAppClick(appointment.phoneNumber!)
                              }
                              className="text-green-500 hover:text-green-600"
                              title="Abrir WhatsApp"
                            >
                              <FaWhatsapp size={20} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-gray-300">
                            Telefone não disponível
                          </p>
                        )}
                        <p className="text-gray-300">
                          Serviço: {appointment.serviceName}
                        </p>
                        <p className="text-gray-300">
                          Barbeiro: {appointment.barberName}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
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
                      <p className="text-sm text-gray-400">
                        {barber.description}
                      </p>
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
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
                <Textarea
                  value={newBarber.description}
                  onChange={(e) =>
                    setNewBarber({ ...newBarber, description: e.target.value })
                  }
                  placeholder="Descrição"
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
                <Button
                  type="submit"
                  className="hover:bg-primary-dark bg-primary text-gray-900"
                >
                  Adicionar Barbeiro
                </Button>
              </form>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-200">
                Gerenciar Serviços
              </h2>
              <div className="mb-4 max-h-[400px] overflow-y-auto">
                <ul className="space-y-2">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-800 p-3"
                    >
                      {editingService?.id === service.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleUpdateService(service.id, editingService)
                          }}
                          className="flex w-full items-center gap-2"
                        >
                          <Input
                            value={editingService.name}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                name: e.target.value,
                              })
                            }
                            className="flex-grow"
                          />
                          <Input
                            value={editingService.price.toString()}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                price: parseFloat(e.target.value),
                              })
                            }
                            type="number"
                            step="0.01"
                            className="w-24"
                          />
                          <Button type="submit">Salvar</Button>
                          <Button
                            onClick={() => setEditingService(null)}
                            variant="outline"
                          >
                            Cancelar
                          </Button>
                        </form>
                      ) : (
                        <>
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={service.imageUrl}
                                alt={service.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-gray-100">
                                {service.name}
                              </span>
                              <p className="line-clamp-2 text-sm text-gray-400">
                                {service.description}
                              </p>
                              <p className="text-sm text-gray-300">
                                R$ {Number(service.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingService(service)}
                              className="bg-blue-900 text-gray-100 hover:bg-blue-800"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRemoveService(service.id)}
                              className="bg-red-900 text-gray-100 hover:bg-red-800"
                            >
                              Remover
                            </Button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <form onSubmit={handleAddService} className="space-y-2">
                <Input
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  placeholder="Nome do serviço"
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
                <Textarea
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descrição"
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
                <Input
                  value={newService.imageUrl}
                  onChange={(e) =>
                    setNewService({ ...newService, imageUrl: e.target.value })
                  }
                  placeholder="URL da imagem"
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                  placeholder="Preço"
                  className="border-gray-700 bg-gray-800 text-gray-100"
                />
                <Button
                  type="submit"
                  className="hover:bg-primary-dark bg-primary text-gray-900"
                >
                  Adicionar Serviço
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  )
}
