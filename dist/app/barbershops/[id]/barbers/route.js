import { NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
export async function GET(request, { params }) {
    const barbershopId = params.id;
    console.log("Received barbershopId:", barbershopId);
    try {
        const barbers = await db.barber.findMany({
            where: { barbershopId: barbershopId },
        });
        console.log("Found barbers:", barbers);
        return NextResponse.json(barbers);
    }
    catch (error) {
        console.error("Error fetching barbers:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
