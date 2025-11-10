import dayjs from "dayjs";

export const nowIso = () => dayjs().toISOString();

export const withinLastMinutes = (iso, minutes) =>
  dayjs(iso).isAfter(dayjs().subtract(minutes, "minute"));

export const pruneOlderThanMinutes = (events, minutes) => {
  const edge = dayjs().subtract(minutes, "minute");
  return events.filter(e => dayjs(e.timestamp).isAfter(edge));
};
