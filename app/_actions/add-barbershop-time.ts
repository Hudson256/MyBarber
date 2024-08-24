// _actions/add-barbershop-time.ts
import { db } from "./../_lib/prisma"

interface AddBarbershopTimeProps {
  barbershopId: string
  time: string
}

export async function addBarbershopTime({
  barbershopId,
  time,
}: AddBarbershopTimeProps) {
  // Lógica para adicionar horário
  await db.booking.create({
    data: {
      barbershopId,
      date: new Date(time),
      serviceId: "service_id", // Passe o ID do serviço correspondente
      userId: "user_id", // Passe o ID do usuário que está criando o horário
    },
  })
}
