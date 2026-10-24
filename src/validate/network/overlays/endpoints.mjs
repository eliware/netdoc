import { createDiagnostic } from "../../../diagnostics.mjs";
import { objectReferenceDiagnostics } from "../../../object-reference-diagnostics.mjs";

const endpointKinds = ["physical-machine", "virtual-machine", "network-device"];

export function validateOverlayEndpointReferences(record, entitiesById) {
  const endpoints = record.data.encapsulation?.endpoints ?? [];
  return [
    ...validateEndpointObjects(endpoints, record, entitiesById),
    ...validateEndpointInterfaces(endpoints, record, entitiesById),
  ];
}

function validateEndpointObjects(endpoints, record, entitiesById) {
  const checks = endpoints.map((endpoint, index) => [
    endpoint.nodeId,
    `/encapsulation/endpoints/${index}/nodeId`,
    endpointKinds,
  ]);
  return objectReferenceDiagnostics(checks, record, entitiesById);
}

function validateEndpointInterfaces(endpoints, record, entitiesById) {
  return endpoints.flatMap((endpoint, index) => {
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
    const segmentIds = [
      networkInterface.segmentId,
      ...(networkInterface.wireless?.broadcasts ?? []).map(({ segmentId }) => segmentId),
    ].filter((id) => id !== undefined);
    if (
      underlaySegmentId !== undefined &&
      segmentIds.length > 0 &&
      !segmentIds.includes(underlaySegmentId)
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
