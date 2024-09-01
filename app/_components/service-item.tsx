"use client"

import { Barbershop, BarbershopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState, useCallback } from "react"
import { set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"
import { useRouter } from "next/navigation"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "id" | "name">
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBarberId, setSelectedBarberId] = useState<string | undefined>(
    undefined,
  )
  const [barbers, setBarbers] = useState<Array<{ id: string; name: string }>>(
    [],
  )
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(false)

  const fetchTimes = useCallback(async () => {
    if (!selectedDay) return
    setIsLoading(true)
    try {
      console.log(
        "Fetching times for:",
        barbershop.id,
        selectedDay.toISOString(),
      )
      const response = await fetch(
        `/api/barbershop-times?barbershopId=${barbershop.id}&date=${selectedDay.toISOString()}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch available times")
      }
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
      console.error("Erro ao buscar horários disponíveis:", error)
      toast.error(
        "Erro ao carregar horários disponíveis. Por favor, tente novamente.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [selectedDay, barbershop.id])

  const fetchBarbers = useCallback(async () => {
    if (!barbershop.id) return
    setIsLoadingBarbers(true)
    try {
      const response = await fetch(`/api/barbers?barbershopId=${barbershop.id}`)
      if (!response.ok) {
        throw new Error("Falha ao buscar barbeiros")
      }
      const data = await response.json()
      setBarbers(data)
    } catch (error) {
      console.error("Erro ao buscar barbeiros:", error)
      toast.error("Erro ao carregar barbeiros. Por favor, tente novamente.")
    } finally {
      setIsLoadingBarbers(false)
    }
  }, [barbershop.id])

  useEffect(() => {
    if (selectedDay) {
      fetchTimes()
    }
  }, [selectedDay, fetchTimes])

  useEffect(() => {
    fetchBarbers()
  }, [fetchBarbers])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime.split(":")[0]),
      minutes: Number(selectedTime.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (session?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setSelectedBarberId(undefined)
    setAvailableTimes([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(undefined)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate || !session?.user?.id || !selectedBarberId) {
        toast.error("Por favor, selecione uma data, hora e barbeiro.")
        return
      }
      await createBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        date: selectedDate,
        userId: session.user.id,
        barberId: selectedBarberId,
      })
      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.error("Erro ao criar reserva:", error)
      if (error instanceof Error) {
        toast.error(`Erro ao criar reserva: ${error.message}`)
      } else {
        toast.error("Erro ao criar reserva. Por favor, tente novamente.")
      }
    }
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* IMAGE */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          {/* DIREITA */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            {/* PREÇO E BOTÃO */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="min-w-16vw flex min-h-[100vh] flex-col items-center overflow-y-auto overflow-x-hidden px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                    />
                  </div>

                  {selectedDay && (
                    <div className="min-h-auto flex flex-wrap justify-evenly gap-2 border-b border-solid p-5">
                      {isLoading ? (
                        <p>Carregando horários...</p>
                      ) : availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedDay && selectedTime && (
                    <div className="border-t border-solid p-5">
                      <h3 className="mb-3 font-bold">Selecione um barbeiro:</h3>
                      {isLoadingBarbers ? (
                        <p>Carregando barbeiros...</p>
                      ) : barbers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {barbers.map((barber) => (
                            <Button
                              key={barber.id}
                              variant={
                                selectedBarberId === barber.id
                                  ? "default"
                                  : "outline"
                              }
                              className="flex-1"
                              onClick={() => setSelectedBarberId(barber.id)}
                            >
                              {barber.name}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p>Nenhum barbeiro disponível.</p>
                      )}
                    </div>
                  )}

                  {selectedDate && selectedBarberId && (
                    <div className="p-5">
                      <BookingSummary
                        barbershop={barbershop}
                        service={service}
                        selectedDate={selectedDate}
                        selectedBarberId={selectedBarberId}
                        barbers={barbers}
                      />
                    </div>
                  )}
                  <SheetFooter className="mt-5 px-5">
                    <Button
                      onClick={handleCreateBooking}
                      disabled={
                        !selectedDay || !selectedTime || !selectedBarberId
                      }
                    >
                      Confirmar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
