import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { updatePegawaiSchema } from "@/shared/lib/validations";
import type { ApiResponse } from "@/shared/types";
import type { Pegawai } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pegawai = await prisma.pegawai.findUnique({
      where: { id },
      include: {
        _count: {
          select: { absensi: true },
        },
      },
    });

    if (!pegawai) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Pegawai tidak ditemukan",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Pegawai> = {
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validatedData = updatePegawaiSchema.parse(body);

    const existingPegawai = await prisma.pegawai.findUnique({
      where: { id },
    });

    if (!existingPegawai) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Pegawai tidak ditemukan",
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (validatedData.email && validatedData.email !== existingPegawai.email) {
      const emailExists = await prisma.pegawai.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        const response: ApiResponse<never> = {
          success: false,
          error: "Email sudah terdaftar",
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    const pegawai = await prisma.pegawai.update({
      where: { id },
      data: validatedData,
    });

    const response: ApiResponse<Pegawai> = {
      success: true,
      data: pegawai,
      message: "Pegawai berhasil diperbarui",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error updating pegawai:", error);

    if (error.name === "ZodError") {
      const response: ApiResponse<never> = {
        success: false,
        error: "Data tidak valid",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal memperbarui pegawai",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingPegawai = await prisma.pegawai.findUnique({
      where: { id },
    });

    if (!existingPegawai) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Pegawai tidak ditemukan",
      };
      return NextResponse.json(response, { status: 404 });
    }

    await prisma.pegawai.delete({
      where: { id },
    });

    const response: ApiResponse<never> = {
      success: true,
      message: "Pegawai berhasil dihapus",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting pegawai:", error);
    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal menghapus pegawai",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
