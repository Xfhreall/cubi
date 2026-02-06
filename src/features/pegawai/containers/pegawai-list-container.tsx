"use client";

import { useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select";
import { TableSkeleton } from "@/shared/components/custom/loading-skeleton";
import { PegawaiForm } from "../components/pegawai-form";
import { PegawaiTable } from "../components/pegawai-table";
import { useGetPegawai } from "../hooks/use-pegawai-query";
import {
  useCreatePegawai,
  useUpdatePegawai,
  useDeletePegawai,
} from "../hooks/use-pegawai-mutation";
import type { Pegawai } from "@prisma/client";
import type { CreatePegawaiInput } from "@/shared/lib/validations";

export function PegawaiListContainer() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setlimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);

  const filters: any = {};
  if (search) filters.search = search;
  if (statusFilter !== "all") {
    filters.statusAktif = statusFilter === "active";
  }

  const { data: pegawai, isLoading } = useGetPegawai(filters);
  const createMutation = useCreatePegawai();
  const updateMutation = useUpdatePegawai();
  const deleteMutation = useDeletePegawai();

  const handleCreate = async (data: CreatePegawaiInput) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Pegawai berhasil ditambahkan!");
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan pegawai");
    }
  };

  const handleUpdate = async (data: CreatePegawaiInput) => {
    if (!editingPegawai) return;

    try {
      await updateMutation.mutateAsync({
        id: editingPegawai.id,
        data,
      });
      toast.success("Pegawai berhasil diperbarui!");
      setEditingPegawai(null);
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui pegawai");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Pegawai berhasil dihapus!");
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus pegawai");
    }
  };

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = pegawai?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((pegawai?.length || 0) / limit);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Data Pegawai</h1>
          <p className="text-muted-foreground">
            Kelola data pegawai perusahaan
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pegawai
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {isLoading ? (
        <TableSkeleton rows={limit} />
      ) : (
        <PegawaiTable
          data={paginatedData}
          onEdit={setEditingPegawai}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
          limit={limit}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onlimitChange={(newSize) => {
            setlimit(newSize);
            setPage(1);
          }}
        />
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Pegawai Baru</DialogTitle>
          </DialogHeader>
          <PegawaiForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingPegawai}
        onOpenChange={() => setEditingPegawai(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pegawai</DialogTitle>
          </DialogHeader>
          {editingPegawai && (
            <PegawaiForm
              initialData={editingPegawai}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
