import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { checkInSchema } from "@/shared/lib/validations";
import type { ApiResponse } from "@/shared/types";
import type { Absensi } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

// POST /api/absensi/check-in - Check in employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = checkInSchema.parse(body);

    const now = new Date();
    const tanggal = validatedData.tanggal
      ? new Date(validatedData.tanggal)
      : now;
    const jamMasuk = validatedData.jamMasuk
      ? new Date(validatedData.jamMasuk)
      : now;

    // Normalize tanggal to date only (remove time)
    const tanggalOnly = startOfDay(tanggal);

    // Check if employee exists
    const pegawai = await prisma.pegawai.findUnique({
      where: { id: validatedData.pegawaiId },
    });

    if (!pegawai) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Pegawai tidak ditemukan",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if already checked in today
    const existingAbsensi = await prisma.absensi.findUnique({
      where: {
        pegawaiId_tanggal: {
          pegawaiId: validatedData.pegawaiId,
          tanggal: tanggalOnly,
        },
      },
    });

    if (existingAbsensi) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Sudah melakukan check-in hari ini",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Create absensi record
    const absensi = await prisma.absensi.create({
      data: {
        pegawaiId: validatedData.pegawaiId,
        tanggal: tanggalOnly,
        jamMasuk,
        status: "HADIR",
      },
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

    const response: ApiResponse<Absensi> = {
      success: true,
      data: absensi,
      message: "Check-in berhasil",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error checking in:", error);

    if (error.name === "ZodError") {
      const response: ApiResponse<never> = {
        success: false,
        error: "Data tidak valid",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal melakukan check-in",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
