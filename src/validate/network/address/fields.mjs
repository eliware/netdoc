import { createDiagnostic } from "../../../diagnostics.mjs";
import { validNetworkAddressValue } from "./value.mjs";

export function validateNetworkAddressFields(fields, record) {
  return fields.flatMap(([pointer, value, network, options]) => {
    if (value === undefined || validNetworkAddressValue(value, network, pointer, options))
      return [];
    return [
      createDiagnostic(
        record.file,
        pointer,
        record.data.id,
        `Invalid IP address or network '${value}'.`,
        "Use a valid IP address or network prefix.",
      ),
    ];
  });
}
