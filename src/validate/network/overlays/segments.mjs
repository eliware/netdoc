import { createDiagnostic } from "../../../diagnostics.mjs";
import { validateNetworkSegmentReference } from "../segment-reference.mjs";

export function validateOverlaySegmentReferences(record, entitiesById) {
  const overlayDiagnostics = (record.data.networking?.overlaySegmentIds ?? []).flatMap(
    (id, index) => validateOverlaySegmentId(id, index, record, entitiesById),
  );
  const underlayDiagnostics = validateNetworkSegmentReference(
    record.data.encapsulation?.underlaySegmentId,
    record,
    "/encapsulation/underlaySegmentId",
    entitiesById,
  );
  return [...overlayDiagnostics, ...underlayDiagnostics];
}

function validateOverlaySegmentId(id, index, record, entitiesById) {
  const pointer = `/networking/overlaySegmentIds/${index}`;
  const target = entitiesById.get(id);
  const diagnostics = validateNetworkSegmentReference(id, record, pointer, entitiesById);
  if (diagnostics.length > 0 || target?.invalid) return diagnostics;
  if (target.record.data.encapsulation?.type === "vxlan") return [];
  return [
    createDiagnostic(
      record.file,
      pointer,
      record.data.id,
      `Network segment ${id} does not define VXLAN encapsulation.`,
      "Use the ID of a network segment with VXLAN encapsulation.",
    ),
  ];
}
