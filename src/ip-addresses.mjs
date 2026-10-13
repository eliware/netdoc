import { isIP } from "node:net";
import { ipv4ToBigInt } from "./ipv4-to-bigint.mjs";
import { ipv6ToBigInt } from "./ipv6-to-bigint.mjs";

export function parseAddress(value) {
  if (typeof value !== "string") return undefined;
  const [address, prefixText, extra] = value.split("/");
  if (extra !== undefined || isIP(address) === 0) return undefined;
  const version = isIP(address);
  const bits = version === 4 ? 32 : 128;
  const prefix = prefixText === undefined ? bits : Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > bits) return undefined;
  const integer = version === 4 ? ipv4ToBigInt(address) : ipv6ToBigInt(address);
  return { version, bits, prefix, integer, first: integer >> BigInt(bits - prefix), text: address };
}
