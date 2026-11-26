export default function addressRange(parsed) {
  const hostBits = BigInt(parsed.bits - parsed.prefix);
  const start = (parsed.integer >> hostBits) << hostBits;
  if (parsed.integer !== start) return { start: parsed.integer, end: parsed.integer };
  return { start, end: start + (1n << hostBits) - 1n };
}
