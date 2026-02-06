import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import type { ApiResponse } from "@/shared/types";
import type { Absensi } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pegawaiId = searchParams.get("pegawaiId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const status = searchParams.get("status");

    const where: any = {};

    if (pegawaiId) {
      where.pegawaiId = pegawaiId;
    }

    if (dateFrom || dateTo) {
      where.tanggal = {};
      if (dateFrom) {
        where.tanggal.gte = startOfDay(new Date(dateFrom));
      }
      if (dateTo) {
        where.tanggal.lte = endOfDay(new Date(dateTo));
      }
    }

    if (status) {
      where.status = status;
    }

    const absensi = await prisma.absensi.findMany({
      where,
      orderBy: { tanggal: "desc" },
      include: {
        pegawai: {
          select: {
            id: true,
            nama: true,
            jabatan: true,
          },
        },
      },
    });

    const response: ApiResponse<Absensi[]> = {
      success: true,
      data: absensi,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching absensi:", error);
    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal mengambil data absensi",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
