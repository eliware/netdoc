import { createDiagnostic } from "./diagnostics.mjs";

export function validateInterfaceAddressUniqueness(
  networkInterface,
  addressAssignment,
  parsed,
  cidr,
  record,
  pointer,
  assignments,
) {
  if (addressAssignment.assignment === "virtual" || networkInterface.segmentId === undefined)
    return [];
  const key = `${networkInterface.segmentId}:${parsed.version}:${parsed.integer}`;
  const previous = assignments.get(key);
  if (previous)
    return [
      createDiagnostic(
        record.file,
        pointer,
        record.data.id,
        `Address ${cidr} is already assigned at ${previous.file}#${previous.pointer}.`,
        "Use a unique address on this segment or mark a shared address as virtual.",
      ),
    ];
  assignments.set(key, { file: record.file, pointer });
  return [];
}
