import { addDefaultHoursToExistingBarbershops } from "../app/_actions/add-default-hours-to-existing-barbershops.js"
import { db } from "../app/_lib/prisma.js"

async function main() {
  console.log("Adicionando horários padrão para todas as barbearias...")
  await addDefaultHoursToExistingBarbershops()
  console.log("Horários padrão adicionados com sucesso!")
  await db.$disconnect()
}

main().catch((error) => {
  console.error("Erro ao adicionar horários padrão:", error)
  process.exit(1)
})
