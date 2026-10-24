import { createDiagnostic } from "../../diagnostics.mjs";
import { objectReferenceDiagnostics } from "../../object-reference-diagnostics.mjs";
import { validateNetworkSegmentReference } from "./segment-reference.mjs";

const endpointKinds = ["physical-machine", "virtual-machine", "network-device"];

export function validateOverlayReferences(record, entitiesById) {
  return [
    ...validateOverlaySegmentIds(record, entitiesById),
    ...validateUnderlaySegment(record, entitiesById),
    ...validateEndpointReferences(record, entitiesById),
    ...validateEndpointInterfaces(record, entitiesById),
  ];
}

function validateOverlaySegmentIds(record, entitiesById) {
  return (record.data.networking?.overlaySegmentIds ?? []).flatMap((id, index) => {
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
  });
}

function validateUnderlaySegment(record, entitiesById) {
  const id = record.data.encapsulation?.underlaySegmentId;
  return validateNetworkSegmentReference(
    id,
    record,
    "/encapsulation/underlaySegmentId",
    entitiesById,
  );
}

function validateEndpointReferences(record, entitiesById) {
  const checks = (record.data.encapsulation?.endpoints ?? []).map((endpoint, index) => [
    endpoint.nodeId,
    `/encapsulation/endpoints/${index}/nodeId`,
    endpointKinds,
  ]);
  return objectReferenceDiagnostics(checks, record, entitiesById);
}

function validateEndpointInterfaces(record, entitiesById) {
  return (record.data.encapsulation?.endpoints ?? []).flatMap((endpoint, index) => {
    if (endpoint.interfaceName === undefined) return [];
    const target = entitiesById.get(endpoint.nodeId);
    if (!target || target.invalid || !endpointKinds.includes(target.kind)) return [];
    const interfaces = target.record.data.interfaces ?? [];
    const networkInterface = interfaces.find((item) => item.name === endpoint.interfaceName);
    if (!networkInterface)
      return [
        createDiagnostic(
          record.file,
          `/encapsulation/endpoints/${index}/interfaceName`,
          record.data.id,
          `Interface name '${endpoint.interfaceName}' does not exist on the referenced object.`,
          "Use the name of an interface on the referenced object.",
        ),
      ];
    const underlaySegmentId = record.data.encapsulation.underlaySegmentId;
    if (
      networkInterface.segmentId !== undefined &&
      underlaySegmentId !== undefined &&
      networkInterface.segmentId !== underlaySegmentId
    )
      return [
        createDiagnostic(
          record.file,
          `/encapsulation/endpoints/${index}/interfaceName`,
          record.data.id,
          `Interface '${endpoint.interfaceName}' does not use the referenced underlay segment.`,
          "Use an interface on the referenced underlay segment.",
        ),
      ];
    return [];
  });
}
