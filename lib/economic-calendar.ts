// Economic calendar with major market-moving events
// Events are hardcoded with typical dates; can be updated manually or via an API

export interface EconomicEvent {
  date: Date;
  time: string; // HH:MM ET
  country: "US" | "GLOBAL";
  event: string;
  impact: "high" | "medium" | "low"; // RED / AMBER / GREEN
  expected?: string;
  forecast?: string;
  description: string;
}

export function getUpcomingEvents(daysAhead: number = 30): EconomicEvent[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  // Major recurring events - manually maintained with verified dates
  const events: EconomicEvent[] = [
    // Weekly jobless claims - Every Thursday at 8:30 AM ET
    {
      date: new Date(2026, 7, 13), // Aug 13
      time: "08:30",
      country: "US",
      event: "Initial Jobless Claims",
      impact: "medium",
      description: "Weekly unemployment claims. Watch for trend changes.",
    },
    {
      date: new Date(2026, 7, 20), // Aug 20
      time: "08:30",
      country: "US",
      event: "Initial Jobless Claims",
      impact: "medium",
      description: "Weekly unemployment claims. Watch for trend changes.",
    },
    {
      date: new Date(2026, 7, 27), // Aug 27
      time: "08:30",
      country: "US",
      event: "Initial Jobless Claims",
      impact: "medium",
      description: "Weekly unemployment claims. Watch for trend changes.",
    },
    // Retail Sales - Mid-month
    {
      date: new Date(2026, 7, 14), // Aug 14
      time: "08:30",
      country: "US",
      event: "Retail Sales",
      impact: "medium",
      description: "Consumer spending. GDP component.",
    },
    // PPI - Mid-month
    {
      date: new Date(2026, 7, 15), // Aug 15
      time: "08:30",
      country: "US",
      event: "PPI (Producer Prices)",
      impact: "high",
      description: "Producer Price Index. Pre-inflation signal.",
    },
    // CPI - Mid-month
    {
      date: new Date(2026, 7, 19), // Aug 19
      time: "08:30",
      country: "US",
      event: "CPI (Inflation)",
      impact: "high",
      description: "Consumer Price Index. Drives Fed policy expectations.",
    },
    // NFP - First Friday of month
    {
      date: new Date(2026, 8, 4), // Sept 4 (first Friday of Sept)
      time: "08:30",
      country: "US",
      event: "Non-Farm Payroll (NFP)",
      impact: "high",
      description: "Jobs report; biggest monthly jobs surprise driver. Move entire market.",
    },
    // FOMC Decision
    {
      date: new Date(2026, 8, 15), // Sept 15
      time: "14:00",
      country: "US",
      event: "FOMC Decision & Powell Press Conference",
      impact: "high",
      description: "Federal Reserve rate decision + guidance. Moves all markets.",
    },
    // ISM Manufacturing
    {
      date: new Date(2026, 8, 1), // Sept 1
      time: "10:00",
      country: "US",
      event: "ISM Manufacturing PMI",
      impact: "medium",
      description: "Manufacturing activity & sentiment. Economic health indicator.",
    },
    // Durable Goods
    {
      date: new Date(2026, 8, 24), // Sept 24
      time: "08:30",
      country: "US",
      event: "Durable Goods Orders",
      impact: "medium",
      description: "Orders for big-ticket manufacturing. Forward-looking.",
    },
    // GDP (Advance)
    {
      date: new Date(2026, 9, 28), // Oct 28
      time: "08:30",
      country: "US",
      event: "GDP (Advance)",
      impact: "high",
      description: "Quarterly economic growth. Market sentiment driver.",
    },
  ];

  // Filter to upcoming events within timeframe and sort by date
  return events
    .filter((e) => e.date >= now && e.date <= cutoff)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Helper functions for event date calculations

function getFirstFridayOfMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstFriday = new Date(firstDay);

  // Find first Friday
  const dayOfWeek = firstDay.getDay();
  const daysUntilFriday = dayOfWeek === 5 ? 0 : dayOfWeek > 5 ? 7 - dayOfWeek + 5 : 5 - dayOfWeek;
  firstFriday.setDate(1 + daysUntilFriday);

  // If already passed, get next month's
  if (firstFriday < date) {
    const nextMonth = new Date(year, month + 1, 1);
    return getFirstFridayOfMonth(nextMonth);
  }

  return firstFriday;
}

function getNextThursday(fromDate: Date): Date {
  const date = new Date(fromDate);
  const dayOfWeek = date.getDay();
  const daysAhead = dayOfWeek === 4 ? 7 : (4 - dayOfWeek + 7) % 7 || 7;
  date.setDate(date.getDate() + daysAhead);
  return date;
}

function getNextCPIDate(fromDate: Date): Date {
  // CPI typically released 12 days after month end
  const date = new Date(fromDate);
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 12);
  return nextMonth > fromDate ? nextMonth : new Date(date.getFullYear(), date.getMonth() + 2, 12);
}

function getNextPPIDate(fromDate: Date): Date {
  // PPI typically released 9 days after month end
  const date = new Date(fromDate);
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 9);
  return nextMonth > fromDate ? nextMonth : new Date(date.getFullYear(), date.getMonth() + 2, 9);
}

function getFOMCDates(fromDate: Date, toDate: Date): Date[] {
  // FOMC meets 8 times per year on preset dates (approximate)
  const fomcDates = [
    new Date(2026, 0, 27), // Jan
    new Date(2026, 2, 17), // Mar
    new Date(2026, 4, 5), // May
    new Date(2026, 5, 16), // Jun
    new Date(2026, 6, 28), // Jul
    new Date(2026, 8, 15), // Sep
    new Date(2026, 10, 2), // Nov
    new Date(2026, 11, 15), // Dec
    new Date(2027, 0, 26), // Jan 2027
    new Date(2027, 2, 16), // Mar 2027
  ];

  return fomcDates.filter((date) => date >= fromDate && date <= toDate);
}

function getFirstBusinessDay(fromDate: Date): Date {
  const date = new Date(fromDate);
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  if (nextMonth <= fromDate) {
    nextMonth.setMonth(nextMonth.getMonth() + 1);
  }

  // Find first business day
  while (nextMonth.getDay() === 0 || nextMonth.getDay() === 6) {
    nextMonth.setDate(nextMonth.getDate() + 1);
  }

  return nextMonth;
}

function getNextRetailSalesDate(fromDate: Date): Date {
  // Retail sales typically released mid-month (around 12th-15th)
  const date = new Date(fromDate);
  const mid = new Date(date.getFullYear(), date.getMonth() + 1, 14);
  return mid > fromDate ? mid : new Date(date.getFullYear(), date.getMonth() + 2, 14);
}

function getNextGDPDate(fromDate: Date): Date {
  // GDP released ~25 days after quarter end
  const date = new Date(fromDate);
  const month = date.getMonth();
  let gdpDate: Date;

  if (month < 3) gdpDate = new Date(date.getFullYear(), 3, 25); // Q4 → late Apr
  else if (month < 6) gdpDate = new Date(date.getFullYear(), 6, 25); // Q1 → late Jul
  else if (month < 9) gdpDate = new Date(date.getFullYear(), 9, 25); // Q2 → late Oct
  else gdpDate = new Date(date.getFullYear() + 1, 0, 25); // Q3 → late Jan

  return gdpDate > fromDate ? gdpDate : new Date(date.getFullYear() + 1, ((gdpDate.getMonth() + 3) % 12) || 0, 25);
}

function getNextDurableGoodsDate(fromDate: Date): Date {
  // Durable goods released mid-month
  const date = new Date(fromDate);
  const mid = new Date(date.getFullYear(), date.getMonth() + 1, 24);
  return mid > fromDate ? mid : new Date(date.getFullYear(), date.getMonth() + 2, 24);
}
