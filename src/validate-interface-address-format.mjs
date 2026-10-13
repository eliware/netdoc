import { createDiagnostic } from "./diagnostics.mjs";
import { parseAddress } from "./ip-addresses.mjs";

export function validateInterfaceAddressFormat(cidr, record, pointer) {
  const parsed = parseAddress(cidr);
  if (parsed) return { parsed };
  return {
    diagnostic: createDiagnostic(
      record.file,
      pointer,
      record.data.id,
      `Invalid IP address or prefix '${cidr}'.`,
      "Use a valid IP address with an optional prefix length.",
    ),
  };
}
