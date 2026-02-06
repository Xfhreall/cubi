import type { Pegawai, Absensi, PublicHoliday, StatusAbsensi } from "@prisma/client";

export type { Pegawai, Absensi, PublicHoliday, StatusAbsensi };
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DateRangeFilter {
  from?: Date | string;
  to?: Date | string;
}

export interface PegawaiFilters {
  search?: string;
  jabatan?: string;
  statusAktif?: boolean;
}

export interface AbsensiFilters {
  pegawaiId?: string;
  dateRange?: DateRangeFilter;
  status?: StatusAbsensi;
}

export interface MonthlyReportData {
  pegawaiId: string;
  nama: string;
  jabatan: string;
  totalHariKerja: number;
  totalHadir: number;
  totalIzin: number;
  totalSakit: number;
  totalAlpha: number;
  persentaseKehadiran: number;
}

export interface MonthlyReportFilters {
  month: number;
  year: number;
  pegawaiId?: string;
}
