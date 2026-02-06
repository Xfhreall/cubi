"use client";

import { Calendar } from "@/shared/components/shadcn/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/shadcn/card";
import { useGetHolidays } from "@/features/laporan/hooks/use-laporan-query";
import { Skeleton } from "@/shared/components/shadcn/skeleton";
import { useMemo } from "react";

interface WorkingDaysCalendarProps {
  month: number;
  year: number;
}

export function WorkingDaysCalendar({ month, year }: WorkingDaysCalendarProps) {
  const { data: holidays, isLoading } = useGetHolidays(month, year);

  const workingDaysInfo = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    let workingDays = 0;
    let weekends = 0;
    let holidayCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split("T")[0];

      const isHoliday = holidays?.some((h) => h.tanggal.split("T")[0] === dateStr);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isHoliday) {
        holidayCount++;
      } else if (isWeekend) {
        weekends++;
      } else {
        workingDays++;
      }
    }

    return { workingDays, weekends, holidayCount, totalDays: daysInMonth };
  }, [holidays, month, year]);

  const modifiers = useMemo(() => {
    if (!holidays) return {};

    const holidayDates = holidays.map((h) => new Date(h.tanggal));
    const weekendDates: Date[] = [];
    const workingDates: Date[] = [];

    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split("T")[0];

      const isHoliday = holidays.some((h) => h.tanggal.split("T")[0] === dateStr);

      if (!isHoliday) {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekendDates.push(date);
        } else {
          workingDates.push(date);
        }
      }
    }

    return {
      holiday: holidayDates,
      weekend: weekendDates,
      working: workingDates,
    };
  }, [holidays, month, year]);

  const modifiersStyles = {
    holiday: {
      backgroundColor: "rgb(254 202 202)",
      color: "rgb(127 29 29)",
      fontWeight: "bold",
    },
    weekend: {
      backgroundColor: "rgb(243 244 246)",
      color: "rgb(107 114 128)",
    },
    working: {
      backgroundColor: "rgb(220 252 231)",
      color: "rgb(21 128 61)",
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kalender Hari Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kalender Hari Kerja</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          month={new Date(year, month - 1)}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200 border border-green-600" />
            <span>Hari Kerja ({workingDaysInfo.workingDays})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border border-gray-400" />
            <span>Weekend ({workingDaysInfo.weekends})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-200 border border-red-600" />
            <span>Libur ({workingDaysInfo.holidayCount})</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <span>Total: {workingDaysInfo.totalDays} hari</span>
          </div>
        </div>

        {holidays && holidays.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Hari Libur:</h4>
            <ul className="space-y-1 text-sm">
              {holidays.map((holiday) => (
                <li key={holiday.id} className="flex justify-between">
                  <span>{holiday.nama}</span>
                  <span className="text-muted-foreground">
                    {new Date(holiday.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
