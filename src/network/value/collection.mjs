import { networkAddressPoolFields } from "../address/pool-fields.mjs";
import { networkValueFields } from "./fields.mjs";

export function collectNetworkValueFields(data) {
  return [...networkValueFields(data), ...networkAddressPoolFields(data.networking ?? {})];
}
