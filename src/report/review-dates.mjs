import { parseUtcDay, utcDay } from "./utc-date.mjs";

const millisecondsPerDay = 86_400_000;

export function collectReviewFreshness(records, maxAgeDays, now = new Date()) {
  const today = utcDay(now);
  return records.map((record) => classifyReviewDate(record, today, maxAgeDays));
}

function classifyReviewDate(record, today, maxAgeDays) {
  const lastReviewed = record.data.lastReviewed;
  const row = { file: record.file, name: record.data.name, lastReviewed };
  if (!lastReviewed) return { ...row, status: "missing" };
  const reviewedDay = parseUtcDay(lastReviewed);
  if (reviewedDay === undefined) return { ...row, status: "invalid-date" };
  const ageDays = (today - reviewedDay) / millisecondsPerDay;
  if (ageDays < 0) return { ...row, status: "future", ageDays };
  return { ...row, status: ageDays > maxAgeDays ? "stale" : "current", ageDays };
}
