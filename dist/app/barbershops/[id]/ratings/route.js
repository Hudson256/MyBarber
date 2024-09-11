import { NextResponse } from "next/server";
import { db } from "../../../_lib/prisma"; // Ajuste o caminho conforme a sua estrutura
// Função para lidar com requisições POST
export async function POST(request) {
    try {
        // Obtenha o id da barbearia da URL
        const url = new URL(request.url);
        const barbershopId = url.pathname.split("/")[2];
        // Parse do corpo da requisição
        const data = await request.json();
        const { serviceId, barberId, rating, message, userName, userAvatar } = data;
        // Validação básica dos dados
        if (!serviceId || rating === undefined || !message || !userName) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }
        // Salve a avaliação no banco de dados usando Prisma
        await db.rating.create({
            data: {
                barbershopId,
                serviceId,
                barberId,
                rating,
                message,
                userName, // Adiciona o nome do usuário
                userAvatar, // Adiciona o avatar do usuário
            },
        });
        // Resposta de sucesso
        return NextResponse.json({ message: "Rating submitted successfully!" });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to submit rating" }, { status: 500 });
    }
}
// Função para lidar com requisições GET
export async function GET(request) {
    try {
        // Obtenha o id da barbearia da URL
        const url = new URL(request.url);
        const barbershopId = url.pathname.split("/")[2];
        // Busque todas as avaliações da barbearia
        const ratings = await db.rating.findMany({
            where: {
                barbershopId,
            },
            include: {
                barbershopService: {
                    select: {
                        name: true,
                    },
                },
                barber: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        // Formate as avaliações para resposta
        const formattedRatings = ratings.map((rating) => ({
            id: rating.id,
            userName: rating.userName,
            userAvatar: rating.userAvatar,
            serviceName: rating.barbershopService.name,
            barberName: rating.barber?.name,
            rating: rating.rating,
            message: rating.message,
            createdAt: rating.createdAt,
        }));
        // Resposta com as avaliações
        return NextResponse.json(formattedRatings);
    }
    catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
