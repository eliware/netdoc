import { parseAddress } from "../../../ip-addresses.mjs";

export function validNetworkAddressValue(value, network, pointer, options = {}) {
  if (typeof value !== "string") return false;
  if (value === "any") return options.allowAny === true;
  if (value === "masquerade") return options.allowMasquerade === true;
  const parsed = parseAddress(value);
  return Boolean(
    parsed && (!network || value.includes("/")) && (!options.hostOnly || !value.includes("/")),
  );
}
