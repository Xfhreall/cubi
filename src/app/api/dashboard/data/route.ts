import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, format, subMonths } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export async function GET() {
  try {
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    const [totalPegawai, activePegawai] = await Promise.all([
      prisma.pegawai.count(),
      prisma.pegawai.count({ where: { statusAktif: true } }),
    ]);

    const todayAttendanceCount = await prisma.absensi.count({
      where: {
        tanggal: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        status: "HADIR",
      },
    });

    const daysInMonth = today.getDate();
    const totalPotentialAttendance = activePegawai * daysInMonth;

    const monthlyAttendanceCount = await prisma.absensi.count({
      where: {
        tanggal: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        status: "HADIR",
      },
    });

    const monthlyRate = totalPotentialAttendance > 0
      ? Math.round((monthlyAttendanceCount / totalPotentialAttendance) * 100)
      : 0;

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const hadir = await prisma.absensi.count({
        where: {
          tanggal: { gte: dayStart, lte: dayEnd },
          status: "HADIR",
        },
      });

      const totalAbsen = await prisma.absensi.count({
        where: {
          tanggal: { gte: dayStart, lte: dayEnd },
        },
      });

      weeklyTrend.push({
        date: format(date, "dd MMM", { locale: idLocale }),
        hadir,
        tidakHadir: activePegawai - hadir
      });
    }

    const statusCounts = await prisma.absensi.groupBy({
      by: ["status"],
      where: {
        tanggal: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _count: {
        status: true,
      },
    });

    const statusMap: Record<string, string> = {
      HADIR: "Hadir",
      IZIN: "Izin",
      SAKIT: "Sakit",
      ALPHA: "Alpha",
    };

    const statusDistribution = statusCounts.map((item) => ({
      name: statusMap[item.status] || item.status,
      value: item._count.status,
    }));

    const monthlyComparison = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthHadir = await prisma.absensi.count({
        where: {
          tanggal: { gte: monthStart, lte: monthEnd },
          status: "HADIR",
        },
      });

      const monthRate = Math.min(100, Math.round((monthHadir / (activePegawai * 20)) * 100));

      monthlyComparison.push({
        month: format(date, "MMM", { locale: idLocale }),
        rate: monthRate,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalPegawai,
          activePegawai,
          todayAttendance: todayAttendanceCount,
          monthlyRate,
        },
        charts: {
          weeklyTrend,
          statusDistribution,
          monthlyComparison,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}
