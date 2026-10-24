export function formatReviewFreshness(rows, maxAgeDays, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const lines = [
    `Review freshness as of ${today} UTC (maximum age: ${maxAgeDays} days).`,
    "Status | File | Record | Last reviewed | Age in days",
  ];
  for (const row of rows) {
    lines.push(
      [
        row.status,
        row.file.replaceAll("\\", "/"),
        row.name,
        row.lastReviewed ?? "",
        row.ageDays === undefined ? "" : String(row.ageDays),
      ].join(" | "),
    );
  }
  return lines.join("\n");
}
