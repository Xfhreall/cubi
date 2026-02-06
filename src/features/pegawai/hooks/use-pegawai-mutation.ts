"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Pegawai } from "@prisma/client";
import type { ApiResponse } from "@/shared/types";
import type {
  CreatePegawaiInput,
  UpdatePegawaiInput,
} from "@/shared/lib/validations";
import { pegawaiKeys } from "./use-pegawai-query";

async function createPegawai(data: CreatePegawaiInput): Promise<Pegawai> {
  const response = await fetch("/api/pegawai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Pegawai> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to create pegawai");
  }

  return result.data!;
}

async function updatePegawai(params: {
  id: string;
  data: UpdatePegawaiInput;
}): Promise<Pegawai> {
  const response = await fetch(`/api/pegawai/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.data),
  });

  const result: ApiResponse<Pegawai> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to update pegawai");
  }

  return result.data!;
}

async function deletePegawai(id: string): Promise<void> {
  const response = await fetch(`/api/pegawai/${id}`, {
    method: "DELETE",
  });

  const result: ApiResponse<never> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to delete pegawai");
  }
}

export function useCreatePegawai() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPegawai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pegawaiKeys.lists() });
    },
  });
}

export function useUpdatePegawai() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePegawai,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pegawaiKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pegawaiKeys.detail(data.id) });
    },
  });
}

export function useDeletePegawai() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePegawai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pegawaiKeys.lists() });
    },
  });
}
