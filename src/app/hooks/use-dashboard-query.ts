"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/shared/types";

interface DashboardData {
  stats: {
    totalPegawai: number;
    activePegawai: number;
    todayAttendance: number;
    monthlyRate: number;
  };
  charts: {
    weeklyTrend: { date: string; hadir: number; tidakHadir: number }[];
    statusDistribution: { name: string; value: number }[];
    monthlyComparison: { month: string; rate: number }[];
  };
}

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch("/api/dashboard/data");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const result: ApiResponse<DashboardData> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch dashboard data");
  }

  return result.data;
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000,
  });
}
