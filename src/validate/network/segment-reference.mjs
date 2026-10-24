import { createDiagnostic } from "../../diagnostics.mjs";

export function validateNetworkSegmentReference(id, record, pointer, entitiesById) {
  if (id === undefined) return [];
  const target = entitiesById.get(id);
  if (target?.invalid || target?.kind === "network-segment") return [];
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
