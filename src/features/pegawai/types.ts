import type { Pegawai } from "@prisma/client";

export type { Pegawai };

export interface PegawaiWithStats extends Pegawai {
  _count?: {
    absensi: number;
  };
}
