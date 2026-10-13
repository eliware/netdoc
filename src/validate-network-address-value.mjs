import { parseAddress } from "./ip-addresses.mjs";

export function validNetworkAddressValue(value, network, pointer) {
  if (typeof value !== "string") return false;
  if (value === "any" || (value === "masquerade" && pointer.endsWith("/translation"))) return true;
  const parsed = parseAddress(value);
  return Boolean(parsed && (!network || value.includes("/")));
}
