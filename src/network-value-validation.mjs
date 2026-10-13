import { createDiagnostic } from "./diagnostics.mjs";
import { parseAddress } from "./ip-addresses.mjs";
import { networkValueFields } from "./network-value-fields.mjs";

export function validateNetworkValues(records) {
  const diagnostics = [];
  for (const record of records) {
    for (const [pointer, value, network] of networkValueFields(record.data)) {
      if (value !== undefined && !valid(value, network, pointer))
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

function valid(value, network, pointer) {
  if (typeof value !== "string") return false;
  if (value === "any" || (value === "masquerade" && pointer.endsWith("/translation"))) return true;
  const parsed = parseAddress(value);
  return Boolean(parsed && (!network || value.includes("/")));
}
