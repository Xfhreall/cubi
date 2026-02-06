"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "@/shared/components/custom/data-table";
import type { MonthlyReportData } from "@/shared/types";

interface ReportTableProps {
  data: MonthlyReportData[];
}

export function ReportTable({ data }: ReportTableProps) {
  const columns: ColumnDef<MonthlyReportData>[] = [
    {
      accessorKey: "nama",
      header: ({ column }) => <SortableHeader column={column}>Nama Pegawai</SortableHeader>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nama")}</div>
      ),
    },
    {
      accessorKey: "jabatan",
      header: "Jabatan",
    },
    {
      accessorKey: "totalHariKerja",
      header: ({ column }) => (
        <div className="text-center">
          <SortableHeader column={column}>Hari Kerja</SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalHariKerja")}</div>
      ),
    },
    {
      accessorKey: "totalHadir",
      header: ({ column }) => (
        <div className="text-center">
          <SortableHeader column={column}>Hadir</SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            {row.getValue("totalHadir")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "totalIzin",
      header: ({ column }) => (
        <div className="text-center">
          <SortableHeader column={column}>Izin</SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {row.getValue("totalIzin")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "totalSakit",
      header: ({ column }) => (
        <div className="text-center">
          <SortableHeader column={column}>Sakit</SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {row.getValue("totalSakit")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "totalAlpha",
      header: ({ column }) => (
        <div className="text-center">
          <SortableHeader column={column}>Alpha</SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            {row.getValue("totalAlpha")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "persentaseKehadiran",
      header: ({ column }) => (
        <div className="text-center">
          <SortableHeader column={column}>Kehadiran</SortableHeader>
        </div>
      ),
      cell: ({ row }) => {
        const percentage = row.getValue("persentaseKehadiran") as number;
        return (
          <div className="text-center">
            <span
              className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${percentage >= 90
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : percentage >= 75
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
            >
              {percentage}%
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      limit={20}
      emptyMessage="Belum ada data laporan"
    />
  );
}
