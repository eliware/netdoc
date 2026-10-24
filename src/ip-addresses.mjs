import { isIP } from "node:net";
import { addressToBigInt } from "./ip-addresses/conversion.mjs";

export function parseAddress(value) {
  if (typeof value !== "string") return undefined;
  const [address, prefixText, extra] = value.split("/");
  const version = isIP(address);
  if (extra !== undefined || version === 0) return undefined;
  const bits = version === 4 ? 32 : 128;
  const prefix = prefixText === undefined ? bits : Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > bits) return undefined;
  const integer = addressToBigInt(address, version);
  return { version, bits, prefix, integer, first: integer >> BigInt(bits - prefix), text: address };
}
