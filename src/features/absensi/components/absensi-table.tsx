"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { DataTable, SortableHeader } from "@/shared/components/custom/data-table";
import type { AbsensiWithPegawai } from "../types";

interface AbsensiTableProps {
  data: AbsensiWithPegawai[];
  limit?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onlimitChange?: (limit: number) => void;
}

const statusColors = {
  HADIR: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  IZIN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SAKIT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ALPHA: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusLabels = {
  HADIR: "Hadir",
  IZIN: "Izin",
  SAKIT: "Sakit",
  ALPHA: "Alpha",
};

export function AbsensiTable({
  data,
  limit = 10,
  currentPage = 1,
  totalPages,
  onPageChange,
  onlimitChange,
}: AbsensiTableProps) {
  const columns: ColumnDef<AbsensiWithPegawai>[] = [
    {
      accessorKey: "tanggal",
      header: ({ column }) => <SortableHeader column={column}>Tanggal</SortableHeader>,
      cell: ({ row }) => {
        const date = row.getValue("tanggal") as Date;
        return format(new Date(date), "dd MMM yyyy", { locale: idLocale });
      },
    },
    {
      accessorKey: "pegawai.nama",
      header: ({ column }) => <SortableHeader column={column}>Nama Pegawai</SortableHeader>,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.pegawai.nama}</div>
      ),
    },
    {
      accessorKey: "pegawai.jabatan",
      header: "Jabatan",
      cell: ({ row }) => row.original.pegawai.jabatan,
    },
    {
      accessorKey: "jamMasuk",
      header: ({ column }) => <SortableHeader column={column}>Jam Masuk</SortableHeader>,
      cell: ({ row }) => {
        const time = row.getValue("jamMasuk") as Date | null;
        return time ? format(new Date(time), "HH:mm:ss") : "-";
      },
    },
    {
      accessorKey: "jamKeluar",
      header: ({ column }) => <SortableHeader column={column}>Jam Keluar</SortableHeader>,
      cell: ({ row }) => {
        const time = row.getValue("jamKeluar") as Date | null;
        return time ? format(new Date(time), "HH:mm:ss") : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      limit={limit}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onlimitChange={onlimitChange}
      emptyMessage="Belum ada data absensi"
    />
  );
}
