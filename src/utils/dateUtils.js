import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

export function formatDate(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function formatDisplayDate(date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDayName(date) {
  return format(new Date(date), 'EEEE');
}

export function getWeekDays(date) {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function isSameDateStr(date1, date2) {
  return isSameDay(new Date(date1), new Date(date2));
}

export function parseDateStr(dateStr) {
  return parseISO(dateStr);
}

export function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
}
