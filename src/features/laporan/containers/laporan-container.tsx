"use client";

import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { motion } from "framer-motion";
import { FileText, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/shadcn/button";
import { Label } from "@/shared/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/shadcn/collapsible";
import { Card, CardContent } from "@/shared/components/shadcn/card";
import { TableSkeleton } from "@/shared/components/custom/loading-skeleton";
import { Combobox } from "@/shared/components/custom/combobox";
import { ReportTable } from "../components/report-table";
import { WorkingDaysCalendar } from "../components/working-days-calendar";
import { useGetMonthlyReport } from "../hooks/use-laporan-query";
import { useGetPegawai } from "@/features/pegawai/hooks/use-pegawai-query";
import { useState, useMemo } from "react";
import { cn } from "@/shared/lib/utils";

export function LaporanContainer() {
  const currentDate = new Date();
  const [isOpen, setIsOpen] = useState(true);

  const [month, setMonth] = useQueryState(
    "month",
    parseAsInteger.withDefault(currentDate.getMonth() + 1),
  );
  const [year, setYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(currentDate.getFullYear()),
  );
  const [selectedPegawaiId, setSelectedPegawaiId] = useQueryState(
    "pegawaiId",
    parseAsString.withDefault("all"),
  );

  const pegawaiFilters = useMemo(() => ({}), []);
  const { data: pegawaiList, isLoading: isPegawaiLoading } =
    useGetPegawai(pegawaiFilters);
  const { data: reportData, isLoading } = useGetMonthlyReport(
    month,
    year,
    selectedPegawaiId === "all" ? undefined : selectedPegawaiId,
  );

  const pegawaiOptions = useMemo(() => {
    const options = [{ value: "all", label: "Semua Pegawai" }];
    if (pegawaiList) {
      for (const pegawai of pegawaiList) {
        options.push({ value: pegawai.id, label: pegawai.nama });
      }
    }
    return options;
  }, [pegawaiList]);

  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - i,
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Laporan Bulanan</h1>
        <p className="text-muted-foreground">
          Laporan kehadiran pegawai per bulan
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <Card className="p-0">
                <div className="flex items-center justify-between p-4 ">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter
                  </h2>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <span className="sr-only">Toggle</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          !isOpen && "rotate-180",
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-2 gap-4 pb-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="month">Bulan</Label>
                      <Select
                        value={String(month)}
                        onValueChange={(value) => setMonth(Number(value))}
                      >
                        <SelectTrigger id="month">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Tahun</Label>
                      <Select
                        value={String(year)}
                        onValueChange={(value) => setYear(Number(value))}
                      >
                        <SelectTrigger id="year">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="pegawai">Pegawai</Label>
                      <Combobox
                        options={pegawaiOptions}
                        value={selectedPegawaiId}
                        onValueChange={setSelectedPegawaiId}
                        placeholder={
                          isPegawaiLoading ? "Loading..." : "Pilih Pegawai"
                        }
                        searchPlaceholder="Cari nama pegawai..."
                        emptyText="Pegawai tidak ditemukan."
                        disabled={isPegawaiLoading}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WorkingDaysCalendar month={month} year={year} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Data Laporan
            </h2>
          </div>

          {isLoading ? (
            <TableSkeleton rows={10} />
          ) : (
            <ReportTable data={reportData || []} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
