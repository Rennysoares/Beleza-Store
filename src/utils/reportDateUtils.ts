export type PeriodFilter = 'today' | '7days' | '30days' | 'month';

export function getDateRange(period: PeriodFilter) {
  const now = new Date();

  const startOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const subDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  };

  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };

    case '7days':
      return {
        start: startOfDay(subDays(now, 7)),
        end: endOfDay(now),
      };

    case '30days':
      return {
        start: startOfDay(subDays(now, 30)),
        end: endOfDay(now),
      };

    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}