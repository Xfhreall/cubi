import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { checkOutSchema } from "@/shared/lib/validations";
import type { ApiResponse } from "@/shared/types";
import type { Absensi } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = checkOutSchema.parse(body);

    const now = new Date();
    const jamKeluar = validatedData.jamKeluar
      ? new Date(validatedData.jamKeluar)
      : now;

    const existingAbsensi = await prisma.absensi.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingAbsensi) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Data absensi tidak ditemukan",
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (existingAbsensi.jamKeluar) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Sudah melakukan check-out",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const absensi = await prisma.absensi.update({
      where: { id: validatedData.id },
      data: {
        jamKeluar,
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
      message: "Check-out berhasil",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error checking out:", error);

    if (error.name === "ZodError") {
      const response: ApiResponse<never> = {
        success: false,
        error: "Data tidak valid",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal melakukan check-out",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
