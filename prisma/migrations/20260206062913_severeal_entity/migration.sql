-- CreateEnum
CREATE TYPE "StatusAbsensi" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPHA');

-- CreateTable
CREATE TABLE "pegawai" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL,
    "statusAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi" (
    "id" TEXT NOT NULL,
    "pegawaiId" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "jamMasuk" TIMESTAMP(3),
    "jamKeluar" TIMESTAMP(3),
    "status" "StatusAbsensi" NOT NULL DEFAULT 'HADIR',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_holidays" (
    "id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "isNational" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_email_key" ON "pegawai"("email");

-- CreateIndex
CREATE INDEX "pegawai_email_idx" ON "pegawai"("email");

-- CreateIndex
CREATE INDEX "pegawai_statusAktif_idx" ON "pegawai"("statusAktif");

-- CreateIndex
CREATE INDEX "absensi_pegawaiId_idx" ON "absensi"("pegawaiId");

-- CreateIndex
CREATE INDEX "absensi_tanggal_idx" ON "absensi"("tanggal");

-- CreateIndex
CREATE INDEX "absensi_status_idx" ON "absensi"("status");

-- CreateIndex
CREATE UNIQUE INDEX "absensi_pegawaiId_tanggal_key" ON "absensi"("pegawaiId", "tanggal");

-- CreateIndex
CREATE INDEX "public_holidays_tanggal_idx" ON "public_holidays"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "public_holidays_tanggal_key" ON "public_holidays"("tanggal");

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_pegawaiId_fkey" FOREIGN KEY ("pegawaiId") REFERENCES "pegawai"("id") ON DELETE CASCADE ON UPDATE CASCADE;
