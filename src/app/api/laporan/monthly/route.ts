import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { monthlyReportSchema } from "@/shared/lib/validations";
import type { ApiResponse, MonthlyReportData } from "@/shared/types";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  calculateWorkingDays,
  calculateAttendancePercentage,
} from "@/features/laporan/lib/report-calculator";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const pegawaiId = searchParams.get("pegawaiId");

    const validatedData = monthlyReportSchema.parse({
      month: month ? Number(month) : new Date().getMonth() + 1,
      year: year ? Number(year) : new Date().getFullYear(),
      pegawaiId: pegawaiId || undefined,
    });

    const startDate = startOfMonth(
      new Date(validatedData.year, validatedData.month - 1)
    );
    const endDate = endOfMonth(
      new Date(validatedData.year, validatedData.month - 1)
    );

    const publicHolidays = await prisma.publicHoliday.findMany({
      where: {
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const holidayDates = publicHolidays.map((h) => new Date(h.tanggal));

    const totalHariKerja = calculateWorkingDays(
      validatedData.year,
      validatedData.month,
      holidayDates
    );

    const pegawaiWhere: any = { statusAktif: true };
    if (validatedData.pegawaiId) {
      pegawaiWhere.id = validatedData.pegawaiId;
    }
    const pegawaiList = await prisma.pegawai.findMany({
      where: pegawaiWhere,
      include: {
        absensi: {
          where: {
            tanggal: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    const reportData: MonthlyReportData[] = pegawaiList.map((pegawai) => {
      const absensiRecords = pegawai.absensi;

      const totalHadir = absensiRecords.filter(
        (a) => a.status === "HADIR"
      ).length;
      const totalIzin = absensiRecords.filter((a) => a.status === "IZIN").length;
      const totalSakit = absensiRecords.filter(
        (a) => a.status === "SAKIT"
      ).length;
      const totalAlpha = absensiRecords.filter(
        (a) => a.status === "ALPHA"
      ).length;

      const persentaseKehadiran = calculateAttendancePercentage(
        totalHadir,
        totalHariKerja
      );

      return {
        pegawaiId: pegawai.id,
        nama: pegawai.nama,
        jabatan: pegawai.jabatan,
        totalHariKerja,
        totalHadir,
        totalIzin,
        totalSakit,
        totalAlpha,
        persentaseKehadiran,
      };
    });

    const response: ApiResponse<MonthlyReportData[]> = {
      success: true,
      data: reportData,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error generating monthly report:", error);

    if (error.name === "ZodError") {
      const response: ApiResponse<never> = {
        success: false,
        error: "Data tidak valid",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: false,
      error: "Gagal membuat laporan bulanan",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
