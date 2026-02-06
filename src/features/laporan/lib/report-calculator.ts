import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
  isSameDay,
} from "date-fns";

export function calculateWorkingDays(
  year: number,
  month: number,
  publicHolidays: Date[] = []
): number {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const workingDays = allDays.filter((day) => {
    if (isWeekend(day)) return false;

    const isHoliday = publicHolidays.some((holiday) => isSameDay(day, holiday));
    if (isHoliday) return false;

    return true;
  });

  return workingDays.length;
}

export function calculateAttendancePercentage(
  totalHadir: number,
  totalWorkingDays: number
): number {
  if (totalWorkingDays === 0) return 0;
  return Math.round((totalHadir / totalWorkingDays) * 100);
}
