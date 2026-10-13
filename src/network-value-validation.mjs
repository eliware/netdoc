import { createDiagnostic } from "./diagnostics.mjs";
import { networkAddressPoolFields } from "./network-address-pool-fields.mjs";
import { networkValueFields } from "./network-value-fields.mjs";
import { validNetworkAddressValue } from "./validate-network-address-value.mjs";

export function validateNetworkValues(records) {
  const diagnostics = [];
  for (const record of records) {
    const fields = [
      ...networkValueFields(record.data),
      ...networkAddressPoolFields(record.data.networking ?? {}),
    ];
    for (const [pointer, value, network] of fields) {
      if (value !== undefined && !validNetworkAddressValue(value, network, pointer))
        diagnostics.push(
          createDiagnostic(
            record.file,
            pointer,
            record.data.id,
            `Invalid IP address or network '${value}'.`,
            "Use a valid IP address or network prefix.",
          ),
        );
    }
  }
  return diagnostics;
}
