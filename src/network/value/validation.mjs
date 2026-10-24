import { validateNetworkAddressValues } from "../../validate/network/address/collection.mjs";

export function validateNetworkValues(records) {
  return records.flatMap(validateNetworkAddressValues);
}
