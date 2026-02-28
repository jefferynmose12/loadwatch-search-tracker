import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const PACIFIC_TZ = "America/Los_Angeles";

export function utcIsoToPacificTime(isoString) {
  const utc = new Date(isoString + "Z"); // treat as UTC

  return utc.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function utcIsoToEasternTime(isoString) {
  const utc = new Date(isoString + "Z");

  return utc.toLocaleTimeString("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const toPacificStartTime = (iso) => {
  if (!iso) return "-";
  try {
    const date = new Date(iso);
    const zoned = toZonedTime(date, PACIFIC_TZ);
    return format(zoned, "h:mm aaaaa'm'");
  } catch {
    return "-";
  }
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getStatusClasses = (status) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-800 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
