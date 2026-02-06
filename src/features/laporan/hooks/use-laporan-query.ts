"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, MonthlyReportData } from "@/shared/types";
import type { PublicHoliday } from "@prisma/client";

export const laporanKeys = {
  all: ["laporan"] as const,
  monthly: (month: number, year: number, pegawaiId?: string) =>
    [...laporanKeys.all, "monthly", month, year, pegawaiId] as const,
  holidays: (month: number, year: number) =>
    [...laporanKeys.all, "holidays", month, year] as const,
};

async function fetchMonthlyReport(
  month: number,
  year: number,
  pegawaiId?: string,
): Promise<MonthlyReportData[]> {
  const params = new URLSearchParams({
    month: String(month),
    year: String(year),
  });

  if (pegawaiId) {
    params.append("pegawaiId", pegawaiId);
  }

  const response = await fetch(`/api/laporan/monthly?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch monthly report");
  }

  const result: ApiResponse<MonthlyReportData[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch monthly report");
  }

  return result.data;
}

async function fetchHolidays(
  month: number,
  year: number,
): Promise<PublicHoliday[]> {
  const params = new URLSearchParams({
    month: String(month),
    year: String(year),
  });

  const response = await fetch(`/api/laporan/holidays?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch holidays");
  }

  const result: ApiResponse<PublicHoliday[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch holidays");
  }

  return result.data;
}

export function useGetMonthlyReport(
  month: number,
  year: number,
  pegawaiId?: string,
) {
  return useQuery({
    queryKey: laporanKeys.monthly(month, year, pegawaiId),
    queryFn: () => fetchMonthlyReport(month, year, pegawaiId),
    staleTime: 30 * 60 * 1000,
  });
}

export function useGetHolidays(month: number, year: number) {
  return useQuery({
    queryKey: laporanKeys.holidays(month, year),
    queryFn: () => fetchHolidays(month, year),
    staleTime: 60 * 60 * 1000,
  });
}
