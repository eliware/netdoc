import { networkAddressPoolFields } from "../address-pool-fields.mjs";
import { networkValueFields } from "./fields.mjs";
import { validateNetworkAddressFields } from "../../validate/network/address/fields.mjs";

export function validateNetworkValues(records) {
  return records.flatMap((record) => {
    const fields = [
      ...networkValueFields(record.data),
      ...networkAddressPoolFields(record.data.networking ?? {}),
    ];
    return validateNetworkAddressFields(fields, record);
  });
}
