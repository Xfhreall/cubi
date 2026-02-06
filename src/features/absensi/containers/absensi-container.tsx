"use client";

import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { motion } from "framer-motion";
import { startOfMonth, endOfMonth, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { TableSkeleton } from "@/shared/components/custom/loading-skeleton";
import { CheckInButton } from "../components/check-in-button";
import { AbsensiTable } from "../components/absensi-table";
import { useGetAbsensi } from "../hooks/use-absensi-query";
import { DateRangePicker } from "@/shared/components/custom/date-range-picker";
import { Label } from "@/shared/components/shadcn/label";

export function AbsensiContainer() {
  const [dateFrom, setDateFrom] = useQueryState(
    "dateFrom",
    parseAsString.withDefault(format(startOfMonth(new Date()), "yyyy-MM-dd")),
  );
  const [dateTo, setDateTo] = useQueryState(
    "dateTo",
    parseAsString.withDefault(format(endOfMonth(new Date()), "yyyy-MM-dd")),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setlimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );

  const { data: absensi, isLoading } = useGetAbsensi({
    dateRange: {
      from: dateFrom,
      to: dateTo,
    },
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = absensi?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((absensi?.length || 0) / limit);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateFrom(format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      setDateTo(format(range.to, "yyyy-MM-dd"));
    }
    setPage(1);
  };

  const currentDateRange: DateRange | undefined = {
    from: dateFrom ? new Date(dateFrom) : undefined,
    to: dateTo ? new Date(dateTo) : undefined,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Absensi</h1>
        <p className="text-muted-foreground">Kelola absensi pegawai harian</p>
      </motion.div>

      <CheckInButton />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">Riwayat Absensi</h2>

        <div className="space-y-2">
          <Label>Rentang Tanggal</Label>
          <DateRangePicker
            date={currentDateRange}
            onDateChange={handleDateRangeChange}
          />
        </div>

        {isLoading ? (
          <TableSkeleton rows={limit} />
        ) : (
          <AbsensiTable
            data={paginatedData}
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
      </motion.div>
    </div>
  );
}
