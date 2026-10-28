
import type { TicketPriority } from "../generated/prisma/client.js";

const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 18;

const BUSINESS_HOURS_PER_DAY =
  BUSINESS_END_HOUR - BUSINESS_START_HOUR;

function isBusinessDay(date: Date): boolean {
  const day = date.getDay();

  return day !== 0 && day !== 6;
}

function moveToNextBusinessDay(date: Date): Date {
  const next = new Date(date);

  next.setDate(next.getDate() + 1);
  next.setHours(BUSINESS_START_HOUR, 0, 0, 0);

  while (!isBusinessDay(next)) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

export function calculateSlaDeadline(
  priority: TicketPriority,
  startDate = new Date(),
): Date {
  const deadline = new Date(startDate);

  if (priority === "CRITICAL") {
    deadline.setHours(deadline.getHours() + 1);
    return deadline;
  }

  const businessHours =
    priority === "HIGH"
      ? 4
      : priority === "MEDIUM"
        ? 3 * BUSINESS_HOURS_PER_DAY
        : 5 * BUSINESS_HOURS_PER_DAY;

  let remainingHours = businessHours;

  while (remainingHours > 0) {
    if (!isBusinessDay(deadline)) {
      deadline.setDate(deadline.getDate() + 1);
      deadline.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }

    const currentHour =
      deadline.getHours() +
      deadline.getMinutes() / 60 +
      deadline.getSeconds() / 3600;

    if (currentHour < BUSINESS_START_HOUR) {
      deadline.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }

    if (currentHour >= BUSINESS_END_HOUR) {
      const nextDay = moveToNextBusinessDay(deadline);
      deadline.setTime(nextDay.getTime());
      continue;
    }

    const availableHours = BUSINESS_END_HOUR - currentHour;
    const hoursToAdd = Math.min(remainingHours, availableHours);

    deadline.setTime(
      deadline.getTime() + hoursToAdd * 60 * 60 * 1000,
    );

    remainingHours -= hoursToAdd;

    if (remainingHours > 0) {
      const nextDay = moveToNextBusinessDay(deadline);
      deadline.setTime(nextDay.getTime());
    }
  }

  return deadline;
}
