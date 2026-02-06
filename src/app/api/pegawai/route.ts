import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { createPegawaiSchema } from "@/shared/lib/validations";
import type { ApiResponse } from "@/shared/types";
import type { Pegawai } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const jabatan = searchParams.get("jabatan");
    const statusAktif = searchParams.get("statusAktif");

    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (jabatan) {
      where.jabatan = { contains: jabatan, mode: "insensitive" };
    }

    if (statusAktif !== null && statusAktif !== undefined) {
      where.statusAktif = statusAktif === "true";
    }

    const pegawai = await prisma.pegawai.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { absensi: true },
        },
      },
    });

    const response: ApiResponse<Pegawai[]> = {
      success: true,
      data: pegawai,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching pegawai:", error);
    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal mengambil data pegawai",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = createPegawaiSchema.parse(body);

    const existingPegawai = await prisma.pegawai.findUnique({
      where: { email: validatedData.email },
    });

    if (existingPegawai) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Email sudah terdaftar",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const pegawai = await prisma.pegawai.create({
      data: validatedData,
    });

    const response: ApiResponse<Pegawai> = {
      success: true,
      data: pegawai,
      message: "Pegawai berhasil ditambahkan",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating pegawai:", error);

    if (error.name === "ZodError") {
      const response: ApiResponse<never> = {
        success: false,
        error: "Data tidak valid",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal menambahkan pegawai",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
