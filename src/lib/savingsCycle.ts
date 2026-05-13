/** Savings cycle constants */
export const PENALTY_RATE = 0.035;       // 3.5% early withdrawal penalty
export const FREE_WINDOW_DAYS = 7;       // Last N days of each cycle are penalty-free
export const CYCLE_MONTHS = 3;           // Lock window length in months

export interface CycleInfo {
  hasStarted: boolean;         // User has at least one completed deposit
  cycleNumber: number;         // Which cycle they are currently in (1-based)
  cycleStart: Date;
  cycleEnd: Date;              // Last day of current cycle (inclusive)
  freeWindowStart: Date;       // First day of free withdrawal window
  isInFreeWindow: boolean;     // True if today is inside the penalty-free window
  daysUntilFreeWindow: number; // 0 when isInFreeWindow is true
  daysLeftInCycle: number;     // Days remaining until cycle end (including today)
  penaltyRate: number;         // Always PENALTY_RATE, exposed for UI convenience
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

/**
 * Calculate the cycle info for a user whose first completed deposit
 * occurred on `firstDepositDate`.
 *
 * Cycles repeat every CYCLE_MONTHS months from that anchor date.
 * The last FREE_WINDOW_DAYS days of each cycle are penalty-free.
 */
export function getCycleInfo(firstDepositDate: Date, today: Date = new Date()): CycleInfo {
  const anchor = startOfDay(firstDepositDate);
  const now = startOfDay(today);

  // Walk forward until the next cycle start would be in the future
  let cycleStart = new Date(anchor);
  let cycleNumber = 1;

  while (true) {
    const nextStart = startOfDay(addMonths(cycleStart, CYCLE_MONTHS));
    if (nextStart <= now) {
      cycleStart = nextStart;
      cycleNumber++;
    } else {
      break;
    }
  }

  // cycleEnd is the day before the next cycle starts
  const nextCycleStart = startOfDay(addMonths(cycleStart, CYCLE_MONTHS));
  const cycleEnd = new Date(nextCycleStart);
  cycleEnd.setDate(cycleEnd.getDate() - 1);

  // Free window starts FREE_WINDOW_DAYS before the cycle ends
  const freeWindowStart = new Date(cycleEnd);
  freeWindowStart.setDate(freeWindowStart.getDate() - (FREE_WINDOW_DAYS - 1));

  const isInFreeWindow = now >= freeWindowStart && now <= cycleEnd;
  const daysUntilFreeWindow = isInFreeWindow ? 0 : Math.max(0, daysBetween(now, freeWindowStart));
  const daysLeftInCycle = Math.max(0, daysBetween(now, cycleEnd) + 1);

  return {
    hasStarted: true,
    cycleNumber,
    cycleStart,
    cycleEnd,
    freeWindowStart,
    isInFreeWindow,
    daysUntilFreeWindow,
    daysLeftInCycle,
    penaltyRate: PENALTY_RATE,
  };
}

/**
 * Calculate the penalty and payout for a given withdrawal amount.
 * Returns penalty=0 and payout=amount when no penalty applies.
 */
export function calculatePayout(
  amount: number,
  isPenalized: boolean,
): { penaltyAmount: number; payoutAmount: number } {
  if (!isPenalized) return { penaltyAmount: 0, payoutAmount: amount };
  const penaltyAmount = Math.round(amount * PENALTY_RATE * 100) / 100;
  return { penaltyAmount, payoutAmount: amount - penaltyAmount };
}
