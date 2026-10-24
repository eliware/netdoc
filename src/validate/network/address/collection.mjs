import { collectNetworkValueFields } from "../../../network/value/collection.mjs";
import { validateNetworkAddressFields } from "./fields.mjs";

export function validateNetworkAddressValues(record) {
  return validateNetworkAddressFields(collectNetworkValueFields(record.data), record);
}
