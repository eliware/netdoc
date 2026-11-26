import objectReferenceDiagnostics from "../../../object-reference-diagnostics.mjs";
import validateEndpointInterfaces from "./interfaces.mjs";

const endpointKinds = ["physical-machine", "virtual-machine", "network-device"];

export default function validateOverlayEndpointReferences(record, entitiesById) {
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
