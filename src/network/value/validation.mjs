import { validateNetworkAddressFields } from "../../validate/network/address/fields.mjs";
import { collectNetworkValueFields } from "./collection.mjs";

export function validateNetworkValues(records) {
  return records.flatMap((record) =>
    validateNetworkAddressFields(collectNetworkValueFields(record.data), record),
  );
}
