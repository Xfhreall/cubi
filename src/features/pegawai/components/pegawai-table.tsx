"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/shadcn/alert-dialog";
import {
  DataTable,
  SortableHeader,
} from "@/shared/components/custom/data-table";
import type { Pegawai } from "@prisma/client";
import { useState } from "react";

interface PegawaiTableProps {
  data: Pegawai[];
  onEdit: (pegawai: Pegawai) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  limit?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onlimitChange?: (limit: number) => void;
}

export function PegawaiTable({
  data,
  onEdit,
  onDelete,
  isDeleting,
  limit = 10,
  currentPage = 1,
  totalPages,
  onPageChange,
  onlimitChange,
}: PegawaiTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: ColumnDef<Pegawai>[] = [
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <SortableHeader column={column}>Nama</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nama")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortableHeader column={column}>Email</SortableHeader>
      ),
    },
    {
      accessorKey: "jabatan",
      header: ({ column }) => (
        <SortableHeader column={column}>Jabatan</SortableHeader>
      ),
    },
    {
      accessorKey: "tanggalMasuk",
      header: ({ column }) => (
        <SortableHeader column={column}>Tanggal Masuk</SortableHeader>
      ),
      cell: ({ row }) => {
        const date = row.getValue("tanggalMasuk") as Date;
        return format(new Date(date), "dd MMM yyyy", { locale: idLocale });
      },
    },
    {
      accessorKey: "statusAktif",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("statusAktif") as boolean;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {isActive ? "Aktif" : "Tidak Aktif"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const pegawai = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(pegawai)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteId(pegawai.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        limit={limit}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onlimitChange={onlimitChange}
        emptyMessage="Belum ada data pegawai"
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pegawai?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pegawai dan semua data
              absensi terkait akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
