import { validateInterfaceAddress } from "./address.mjs";

export function validateInterfaceAddresses(records, entitiesById) {
  const diagnostics = [];
  const assignments = new Map();
  for (const record of records) {
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      for (const [addressIndex, assignment] of (networkInterface.addresses ?? []).entries()) {
        if (assignment.cidr === undefined) continue;
        const pointer = `/interfaces/${index}/addresses/${addressIndex}/cidr`;
        diagnostics.push(
          ...validateInterfaceAddress(
            networkInterface,
            assignment,
            record,
            pointer,
            entitiesById,
            assignments,
          ),
        );
      }
    }
  }
  return diagnostics;
}
