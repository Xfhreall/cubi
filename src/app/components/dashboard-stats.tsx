"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import { Users, UserCheck, Clock, CalendarDays } from "lucide-react";
import { Skeleton } from "@/shared/components/shadcn/skeleton";

interface DashboardStatsProps {
  totalPegawai: number;
  activePegawai: number;
  todayAttendance: number;
  monthlyRate: number;
  isLoading: boolean;
}

export function DashboardStats({
  totalPegawai,
  activePegawai,
  todayAttendance,
  monthlyRate,
  isLoading,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Pegawai",
      value: totalPegawai,
      icon: Users,
      desc: "Terdaftar di sistem",
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Pegawai Aktif",
      value: activePegawai,
      icon: UserCheck,
      desc: "Status aktif saat ini",
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Hadir Hari Ini",
      value: todayAttendance,
      icon: Clock,
      desc: "Pegawai check-in",
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Rata-rata Bulan Ini",
      value: `${monthlyRate}%`,
      icon: CalendarDays,
      desc: "Tingkat kehadiran",
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
