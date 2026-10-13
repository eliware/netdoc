import { createDiagnostic } from "./diagnostics.mjs";

export function validateNetworkSegmentReference(id, record, pointer, entitiesById) {
  const target = entitiesById.get(id);
  if (id === undefined || target?.kind === "network-segment" || target?.invalid) return [];
  return [
    createDiagnostic(
      record.file,
      pointer,
      record.data.id,
      `Reference ${id} does not resolve to a network-segment.`,
      "Use the ID of an existing network-segment.",
    ),
  ];
}
