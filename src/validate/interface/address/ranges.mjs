export function addressRange(parsed) {
  const hostBits = BigInt(parsed.bits - parsed.prefix);
  const start = (parsed.integer >> hostBits) << hostBits;
  if (parsed.integer !== start) return { start: parsed.integer, end: parsed.integer };
  return { start, end: start + (1n << hostBits) - 1n };
}

export function rangesOverlap(first, second) {
  return first.start <= second.end && second.start <= first.end;
}
