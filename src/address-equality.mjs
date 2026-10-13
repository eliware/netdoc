import { parseAddress } from "./ip-addresses.mjs";

export function sameAddress(left, right) {
  const first = parseAddress(left);
  const second = parseAddress(right);
  return Boolean(
    first && second && first.version === second.version && first.integer === second.integer,
  );
}
