import type { Absensi, StatusAbsensi } from "@prisma/client";

export type { Absensi, StatusAbsensi };

export interface AbsensiWithPegawai extends Absensi {
  pegawai: {
    id: string;
    nama: string;
    jabatan: string;
  };
}
