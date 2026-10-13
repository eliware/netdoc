import { ipv4ToBigInt } from "./ipv4-to-bigint.mjs";

export function ipv6ToBigInt(address) {
  if (address.includes(".")) {
    const lastColon = address.lastIndexOf(":");
    const ipv4 = ipv4ToBigInt(address.slice(lastColon + 1));
    const high = (ipv4 >> 16n).toString(16);
    const low = (ipv4 & 0xffffn).toString(16);
    address = `${address.slice(0, lastColon)}:${high}:${low}`;
  }
  const halves = address.split("::");
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length > 1 && halves[1] ? halves[1].split(":") : [];
  const groups = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
  return groups.reduce((value, group) => (value << 16n) | BigInt(`0x${group}`), 0n);
}
