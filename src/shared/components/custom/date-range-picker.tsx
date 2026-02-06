"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/shadcn/button";
import { Calendar } from "@/shared/components/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/shadcn/popover";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMM yyyy", { locale: idLocale })} -{" "}
                  {format(date.to, "dd MMM yyyy", { locale: idLocale })}
                </>
              ) : (
                format(date.from, "dd MMM yyyy", { locale: idLocale })
              )
            ) : (
              <span>Pilih rentang tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onDateChange({
                    from: new Date(),
                    to: new Date(),
                  })
                }
              >
                Hari Ini
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onDateChange({
                    from: addDays(new Date(), -6),
                    to: new Date(),
                  })
                }
              >
                7 Hari Terakhir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onDateChange({
                    from: addDays(new Date(), -29),
                    to: new Date(),
                  })
                }
              >
                30 Hari Terakhir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  onDateChange({
                    from: new Date(now.getFullYear(), now.getMonth(), 1),
                    to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
                  });
                }}
              >
                Bulan Ini
              </Button>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
