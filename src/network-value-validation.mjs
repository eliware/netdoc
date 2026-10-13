import { networkAddressPoolFields } from "./network-address-pool-fields.mjs";
import { networkValueFields } from "./network-value-fields.mjs";
import { validateNetworkAddressFields } from "./validate-network-address-fields.mjs";

export function validateNetworkValues(records) {
  return records.flatMap((record) => {
    const fields = [
      ...networkValueFields(record.data),
      ...networkAddressPoolFields(record.data.networking ?? {}),
    ];
    return validateNetworkAddressFields(fields, record);
  });
}
