export default function addressRange(parsed) {
  const hostBits = BigInt(parsed.bits - parsed.prefix);
  const start = (parsed.integer >> hostBits) << hostBits;
  // Host bits identify one address. Aligned CIDRs keep their full range for overlap checks.
  if (parsed.integer !== start) return { start: parsed.integer, end: parsed.integer };
  return { start, end: start + (1n << hostBits) - 1n };
}
