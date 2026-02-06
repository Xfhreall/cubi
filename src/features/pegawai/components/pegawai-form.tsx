"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";
import { Label } from "@/shared/components/shadcn/label";
import { Checkbox } from "@/shared/components/shadcn/checkbox";
import {
  createPegawaiSchema,
  type CreatePegawaiInput,
} from "@/shared/lib/validations";
import type { Pegawai } from "@prisma/client";

interface PegawaiFormProps {
  initialData?: Pegawai;
  onSubmit: (data: CreatePegawaiInput) => void;
  isLoading?: boolean;
}

export function PegawaiForm({
  initialData,
  onSubmit,
  isLoading,
}: PegawaiFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreatePegawaiInput>({
    resolver: zodResolver(createPegawaiSchema),
    defaultValues: initialData
      ? {
        nama: initialData.nama,
        email: initialData.email,
        jabatan: initialData.jabatan,
        tanggalMasuk: initialData.tanggalMasuk,
        statusAktif: initialData.statusAktif,
      }
      : {
        statusAktif: true,
      },
  });

  const statusAktif = watch("statusAktif");

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="nama">
          Nama Lengkap <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nama"
          {...register("nama")}
          placeholder="Masukkan nama lengkap"
          disabled={isLoading}
        />
        {errors.nama && (
          <p className="text-sm text-destructive">{errors.nama.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="nama@example.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="jabatan">
          Jabatan <span className="text-destructive">*</span>
        </Label>
        <Input
          id="jabatan"
          {...register("jabatan")}
          placeholder="Masukkan jabatan"
          disabled={isLoading}
        />
        {errors.jabatan && (
          <p className="text-sm text-destructive">{errors.jabatan.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggalMasuk">
          Tanggal Masuk <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tanggalMasuk"
          type="date"
          {...register("tanggalMasuk")}
          disabled={isLoading}
        />
        {errors.tanggalMasuk && (
          <p className="text-sm text-destructive">
            {errors.tanggalMasuk.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="statusAktif"
          checked={statusAktif}
          onCheckedChange={(checked) => setValue("statusAktif", !!checked)}
          disabled={isLoading}
        />
        <Label htmlFor="statusAktif" className="cursor-pointer">
          Status Aktif
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Menyimpan..." : initialData ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </motion.form>
  );
}
