import { expandIpv4EmbeddedIpv6 } from "./ip/ipv6-expansion.mjs";

export function ipv6ToBigInt(address) {
  address = expandIpv4EmbeddedIpv6(address);
  const halves = address.split("::");
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length > 1 && halves[1] ? halves[1].split(":") : [];
  const groups = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
  return groups.reduce((value, group) => (value << 16n) | BigInt(`0x${group}`), 0n);
}
