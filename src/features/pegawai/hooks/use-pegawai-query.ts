"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Pegawai } from "@prisma/client";
import type { ApiResponse, PegawaiFilters } from "@/shared/types";

export const pegawaiKeys = {
  all: ["pegawai"] as const,
  lists: () => [...pegawaiKeys.all, "list"] as const,
  list: (filters?: PegawaiFilters) =>
    [...pegawaiKeys.lists(), filters] as const,
  details: () => [...pegawaiKeys.all, "detail"] as const,
  detail: (id: string) => [...pegawaiKeys.details(), id] as const,
};

async function fetchPegawai(filters?: PegawaiFilters): Promise<Pegawai[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.jabatan) params.append("jabatan", filters.jabatan);
  if (filters?.statusAktif !== undefined)
    params.append("statusAktif", String(filters.statusAktif));

  const response = await fetch(`/api/pegawai?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch pegawai");
  }

  const result: ApiResponse<Pegawai[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch pegawai");
  }

  return result.data;
}

async function fetchPegawaiById(id: string): Promise<Pegawai> {
  const response = await fetch(`/api/pegawai/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch pegawai");
  }

  const result: ApiResponse<Pegawai> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch pegawai");
  }

  return result.data;
}

export function useGetPegawai(
  filters?: PegawaiFilters
): UseQueryResult<Pegawai[], Error> {
  return useQuery({
    queryKey: pegawaiKeys.list(filters),
    queryFn: () => fetchPegawai(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetPegawaiById(
  id: string
): UseQueryResult<Pegawai, Error> {
  return useQuery({
    queryKey: pegawaiKeys.detail(id),
    queryFn: () => fetchPegawaiById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
