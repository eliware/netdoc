import validateNetworkAddressValues from "../../validate/network/address/collection.mjs";

export default function validateNetworkValues(records) {
  return records.flatMap(validateNetworkAddressValues);
}
