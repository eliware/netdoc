import { parseUtcDay, utcDay } from "./utc-date.mjs";

const millisecondsPerDay = 86_400_000;

export function collectEvidenceFreshness(records, maxAgeDays, now = new Date()) {
  const today = utcDay(now);
  return records.flatMap((record) => {
    const evidence = record.data.evidence ?? [];
    if (evidence.length === 0)
      return [{ status: "no-evidence", file: record.file, name: record.data.name }];
    return evidence.map((item) => classifyEvidence(record, item, today, maxAgeDays));
  });
}

function classifyEvidence(record, item, today, maxAgeDays) {
  const row = {
    file: record.file,
    name: record.data.name,
    source: item.source,
    checkedOn: item.checkedOn,
  };
  if (!item.checkedOn) return { ...row, status: "undated" };
  const checkedDay = parseUtcDay(item.checkedOn);
  if (checkedDay === undefined) return { ...row, status: "invalid-date" };
  const ageDays = (today - checkedDay) / millisecondsPerDay;
  if (ageDays < 0) return { ...row, status: "future", ageDays };
  return { ...row, status: ageDays > maxAgeDays ? "stale" : "current", ageDays };
}
