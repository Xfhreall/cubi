"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import { Button } from "@/shared/components/shadcn/button";
import { DashboardStats } from "./components/dashboard-stats";
import { useDashboardData } from "./hooks/use-dashboard-query";

export default function Home() {
  const { data, isLoading } = useDashboardData();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview sistem absensi dan performa pegawai
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashboardStats
          totalPegawai={data?.stats.totalPegawai || 0}
          activePegawai={data?.stats.activePegawai || 0}
          todayAttendance={data?.stats.todayAttendance || 0}
          monthlyRate={data?.stats.monthlyRate || 0}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}
