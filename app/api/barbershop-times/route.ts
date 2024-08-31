import { NextRequest, NextResponse } from "next/server"
import { getBarbershopTimes } from "../../_actions/get-barbershop-times"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const barbershopId = searchParams.get("barbershopId")
  const date = searchParams.get("date")

  if (!barbershopId || !date) {
    return NextResponse.json(
      { error: "Missing barbershopId or date" },
      { status: 400 },
    )
  }

  try {
    const times = await getBarbershopTimes({
      barbershopId,
      date: new Date(date),
    })
    return NextResponse.json(times)
  } catch (error) {
    console.error("Error fetching barbershop times:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
