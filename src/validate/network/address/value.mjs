import { parseAddress } from "../../../ip-addresses.mjs";

export function validNetworkAddressValue(value, network, pointer, options = {}) {
  if (typeof value !== "string") return false;
  if (value === "any") return options.allowAny === true;
  if (value === "masquerade") return options.allowMasquerade === true;
  const parsed = parseAddress(value);
  if (!parsed) return false;
  if (network) {
    if (!value.includes("/")) return false;
    const hostBits = BigInt(parsed.bits - parsed.prefix);
    if (parsed.integer !== (parsed.integer >> hostBits) << hostBits) return false;
  }
  return !options.hostOnly || !value.includes("/");
}
