"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/shared/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select";
import { useGetPegawai } from "@/features/pegawai/hooks/use-pegawai-query";
import {
  useCheckIn,
  useCheckOut,
  useCheckTodayAttendance,
} from "../hooks/use-absensi-query";

export function CheckInButton() {
  const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: pegawaiList } = useGetPegawai({ statusAktif: true });
  const { data: todayAttendance, refetch: refetchToday } =
    useCheckTodayAttendance(selectedPegawaiId);
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    if (!selectedPegawaiId) {
      toast.warning("Pilih pegawai terlebih dahulu");
      return;
    }

    try {
      await checkInMutation.mutateAsync({
        pegawaiId: selectedPegawaiId,
      });
      toast.success("Check-in berhasil!");
      refetchToday();
    } catch (error: any) {
      toast.error(error.message || "Gagal check-in");
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) return;

    try {
      await checkOutMutation.mutateAsync({
        id: todayAttendance.id,
      });
      toast.success("Check-out berhasil!");
      refetchToday();
    } catch (error: any) {
      toast.error(error.message || "Gagal check-out");
    }
  };

  const isLoading = checkInMutation.isPending || checkOutMutation.isPending;
  const hasCheckedIn = !!todayAttendance;
  const hasCheckedOut = !!todayAttendance?.jamKeluar;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border bg-card p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Absensi Hari Ini</h3>
          <p className="text-sm text-muted-foreground">
            {format(currentTime, "EEEE, dd MMMM yyyy", { locale: idLocale })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-2xl font-mono">
          <Clock className="h-6 w-6" />
          {format(currentTime, "HH:mm:ss")}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Pegawai</label>
          <Select
            value={selectedPegawaiId}
            onValueChange={setSelectedPegawaiId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih pegawai..." />
            </SelectTrigger>
            <SelectContent>
              {pegawaiList?.map((pegawai) => (
                <SelectItem key={pegawai.id} value={pegawai.id}>
                  {pegawai.nama} - {pegawai.jabatan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasCheckedIn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md bg-muted p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Check-in:</span>
              <span className="text-sm">
                {format(new Date(todayAttendance.jamMasuk!), "HH:mm:ss")}
              </span>
            </div>
            {hasCheckedOut && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Check-out:</span>
                <span className="text-sm">
                  {format(new Date(todayAttendance.jamKeluar!), "HH:mm:ss")}
                </span>
              </div>
            )}
          </motion.div>
        )}

        <div className="flex gap-4">
          {!hasCheckedIn ? (
            <Button
              onClick={handleCheckIn}
              disabled={!selectedPegawaiId || isLoading}
              className="flex-1"
              size="lg"
            >
              <LogIn className="h-5 w-5 mr-2" />
              {isLoading ? "Memproses..." : "Check In"}
            </Button>
          ) : !hasCheckedOut ? (
            <Button
              onClick={handleCheckOut}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <LogOut className="h-5 w-5 mr-2" />
              {isLoading ? "Memproses..." : "Check Out"}
            </Button>
          ) : (
            <div className="flex-1 text-center py-3 text-sm text-muted-foreground">
              Absensi hari ini sudah selesai
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
