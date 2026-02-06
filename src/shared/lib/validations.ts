import { z } from "zod";
import { StatusAbsensi } from "@prisma/client";

export const createPegawaiSchema = z.object({
  nama: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid"),
  jabatan: z
    .string()
    .min(2, "Jabatan minimal 2 karakter")
    .max(100, "Jabatan maksimal 100 karakter"),
  tanggalMasuk: z.coerce.date({
    required_error: "Tanggal masuk harus diisi",
    invalid_type_error: "Format tanggal tidak valid",
  }),
  statusAktif: z.boolean().default(true),
});

export const updatePegawaiSchema = createPegawaiSchema.partial();

export type CreatePegawaiInput = z.infer<typeof createPegawaiSchema>;
export type UpdatePegawaiInput = z.infer<typeof updatePegawaiSchema>;

export const checkInSchema = z.object({
  pegawaiId: z.string().cuid("ID pegawai tidak valid"),
  tanggal: z.coerce.date().optional(),
  jamMasuk: z.coerce.date().optional(),
});

export const checkOutSchema = z.object({
  id: z.string().cuid("ID absensi tidak valid"),
  jamKeluar: z.coerce.date().optional(),
});

export const createAbsensiSchema = z.object({
  pegawaiId: z.string().cuid("ID pegawai tidak valid"),
  tanggal: z.coerce.date({
    required_error: "Tanggal harus diisi",
    invalid_type_error: "Format tanggal tidak valid",
  }),
  jamMasuk: z.coerce.date().optional(),
  jamKeluar: z.coerce.date().optional(),
  status: z.nativeEnum(StatusAbsensi).default(StatusAbsensi.HADIR),
  keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
});

export const updateAbsensiSchema = createAbsensiSchema.partial().extend({
  id: z.string().cuid("ID absensi tidak valid"),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type CreateAbsensiInput = z.infer<typeof createAbsensiSchema>;
export type UpdateAbsensiInput = z.infer<typeof updateAbsensiSchema>;

export const createPublicHolidaySchema = z.object({
  tanggal: z.coerce.date({
    required_error: "Tanggal harus diisi",
    invalid_type_error: "Format tanggal tidak valid",
  }),
  nama: z
    .string()
    .min(2, "Nama hari libur minimal 2 karakter")
    .max(100, "Nama hari libur maksimal 100 karakter"),
  keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
  isNational: z.boolean().default(true),
});

export type CreatePublicHolidayInput = z.infer<typeof createPublicHolidaySchema>;

export const monthlyReportSchema = z.object({
  month: z.coerce
    .number()
    .int()
    .min(1, "Bulan harus antara 1-12")
    .max(12, "Bulan harus antara 1-12"),
  year: z.coerce
    .number()
    .int()
    .min(2000, "Tahun minimal 2000")
    .max(2100, "Tahun maksimal 2100"),
  pegawaiId: z
    .string()
    .cuid("ID pegawai tidak valid")
    .optional()
    .nullable()
    .transform((val) => val || undefined),
});

export type MonthlyReportInput = z.infer<typeof monthlyReportSchema>;
