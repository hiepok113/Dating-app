import type { Availability } from "../storage";

interface DateTimeSlot {
  date: string;
  hour: number;
}

export const findCommonSlot = (
  avail1: Availability[],
  avail2: Availability[],
): DateTimeSlot | null => {
  // Convert availability to a list of available (date, hour)
  const getSlots = (avails: Availability[]): Set<string> => {
    const slots = new Set<string>();
    for (const a of avails) {
      if (!a.date || a.startHour === undefined || a.endHour === undefined)
        continue;

      const start = Math.min(a.startHour, a.endHour);
      const end = Math.max(a.startHour, a.endHour);
      for (let h = start; h < end; h++) {
        slots.add(`${a.date}@${h}`);
      }
    }
    return slots;
  };

  const slots1 = getSlots(avail1);
  const slots2 = getSlots(avail2);

  const common = [...slots1].filter((s) => slots2.has(s));

  if (common.length === 0) return null;

  // Find the earliest slot
  common.sort();
  const first = common[0].split("@");

  return {
    date: first[0],
    hour: parseInt(first[1], 10),
  };
};

export const formatSlotTime = (date: string, hour: number): string => {
  // e.g. "2026-03-01 14:00" => format nicely
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  const h = hour.toString().padStart(2, "0");

  return `${day}/${month}/${year} lúc ${h}:00 - ${h}:59`;
};
