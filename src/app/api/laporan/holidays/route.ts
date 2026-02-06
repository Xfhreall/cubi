import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = Number.parseInt(searchParams.get("month") || "");
    const year = Number.parseInt(searchParams.get("year") || "");

    if (!month || !year || month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid month or year",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const holidays = await prisma.publicHoliday.findMany({
      where: {
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: holidays,
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch holidays",
      },
      { status: 500 }
    );
  }
}
