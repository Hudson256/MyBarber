import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const defaultBarbers = [
    { name: "João Silva" },
    { name: "Maria Oliveira" },
    { name: "Carlos Santos" },
];
async function addDefaultBarbersToAllBarbershops() {
    try {
        const barbershops = await prisma.barbershop.findMany();
        for (const barbershop of barbershops) {
            for (const barber of defaultBarbers) {
                await prisma.barber.create({
                    data: {
                        name: barber.name,
                        barbershopId: barbershop.id,
                    },
                });
            }
            console.log(`Barbeiros padrão adicionados para a barbearia: ${barbershop.name}`);
        }
        console.log("Todos os barbeiros padrão foram adicionados com sucesso!");
    }
    catch (error) {
        console.error("Erro ao adicionar barbeiros padrão:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
addDefaultBarbersToAllBarbershops();
