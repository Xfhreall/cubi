"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Absensi } from "@prisma/client";
import type { ApiResponse, AbsensiFilters } from "@/shared/types";
import type { CheckInInput, CheckOutInput } from "@/shared/lib/validations";
import type { AbsensiWithPegawai } from "../types";
import { startOfDay } from "date-fns";

export const absensiKeys = {
  all: ["absensi"] as const,
  lists: () => [...absensiKeys.all, "list"] as const,
  list: (filters?: AbsensiFilters) =>
    [...absensiKeys.lists(), filters] as const,
  today: (pegawaiId: string) =>
    [...absensiKeys.all, "today", pegawaiId] as const,
};

async function fetchAbsensi(
  filters?: AbsensiFilters,
): Promise<AbsensiWithPegawai[]> {
  const params = new URLSearchParams();

  if (filters?.pegawaiId) params.append("pegawaiId", filters.pegawaiId);
  if (filters?.dateRange?.from)
    params.append("dateFrom", filters.dateRange.from.toString());
  if (filters?.dateRange?.to)
    params.append("dateTo", filters.dateRange.to.toString());
  if (filters?.status) params.append("status", filters.status);

  const response = await fetch(`/api/absensi?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch absensi");
  }

  const result: ApiResponse<AbsensiWithPegawai[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch absensi");
  }

  return result.data;
}

async function checkTodayAttendance(
  pegawaiId: string,
): Promise<Absensi | null> {
  const today = startOfDay(new Date());

  const response = await fetch(
    `/api/absensi?pegawaiId=${pegawaiId}&dateFrom=${today.toISOString()}&dateTo=${today.toISOString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to check attendance");
  }

  const result: ApiResponse<Absensi[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to check attendance");
  }

  return result.data.length > 0 ? result.data[0] : null;
}

async function checkIn(data: CheckInInput): Promise<Absensi> {
  const response = await fetch("/api/absensi/check-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Absensi> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to check in");
  }

  return result.data!;
}

async function checkOut(data: CheckOutInput): Promise<Absensi> {
  const response = await fetch("/api/absensi/check-out", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Absensi> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to check out");
  }

  return result.data!;
}

export function useGetAbsensi(filters?: AbsensiFilters) {
  return useQuery({
    queryKey: absensiKeys.list(filters),
    queryFn: () => fetchAbsensi(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCheckTodayAttendance(pegawaiId: string) {
  return useQuery({
    queryKey: absensiKeys.today(pegawaiId),
    queryFn: () => checkTodayAttendance(pegawaiId),
    enabled: !!pegawaiId,
    staleTime: 1 * 60 * 1000,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: absensiKeys.lists() });
      queryClient.invalidateQueries({ queryKey: absensiKeys.all });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: absensiKeys.lists() });
      queryClient.invalidateQueries({ queryKey: absensiKeys.all });
    },
  });
}
