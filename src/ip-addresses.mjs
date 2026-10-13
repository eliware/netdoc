import { isIP } from "node:net";

export function parseAddress(value) {
  if (typeof value !== "string") return undefined;
  const [address, prefixText, extra] = value.split("/");
  if (extra !== undefined || isIP(address) === 0) return undefined;
  const version = isIP(address);
  const bits = version === 4 ? 32 : 128;
  const prefix = prefixText === undefined ? bits : Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > bits) return undefined;
  const integer = version === 4 ? parseIpv4(address) : parseIpv6(address);
  return { version, bits, prefix, integer, first: integer >> BigInt(bits - prefix), text: address };
}

function parseIpv4(address) {
  return address.split(".").reduce((value, part) => (value << 8n) | BigInt(part), 0n);
}

function parseIpv6(address) {
  const halves = address.split("::");
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length > 1 && halves[1] ? halves[1].split(":") : [];
  const groups = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
  return groups.reduce((value, group) => (value << 16n) | BigInt(`0x${group}`), 0n);
}
