const usage = "Usage: netdoc report <path> --freshness --max-age-days DAYS";

export function parseFreshnessArguments(args) {
  if (
    args.length !== 4 ||
    args[1] !== "--freshness" ||
    args[2] !== "--max-age-days" ||
    !/^\d+$/.test(args[3])
  )
    return { error: usage };
  const maxAgeDays = Number(args[3]);
  if (!Number.isSafeInteger(maxAgeDays) || maxAgeDays < 1) return { error: usage };
  return { path: args[0], maxAgeDays };
}
