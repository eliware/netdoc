import { ipv4ToBigInt } from "../ipv4-to-bigint.mjs";
import { ipv6ToBigInt } from "../ipv6-to-bigint.mjs";

export function addressToBigInt(address, version) {
  return version === 4 ? ipv4ToBigInt(address) : ipv6ToBigInt(address);
}
