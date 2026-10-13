export function ipv4ToBigInt(address) {
  return address.split(".").reduce((value, part) => (value << 8n) | BigInt(part), 0n);
}
