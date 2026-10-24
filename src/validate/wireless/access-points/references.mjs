import { objectReferenceDiagnostics } from "../../../object-reference-diagnostics.mjs";

export function validateWirelessAccessPointReferences(record, entitiesById) {
  const checks = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    (networkInterface.wireless?.profiles ?? []).forEach((profile, index) => {
      if (profile.accessPointId === undefined) return;
      const pointer = `/interfaces/${interfaceIndex}/wireless/profiles/${index}/accessPointId`;
      checks.push([profile.accessPointId, pointer, ["network-device"]]);
    });
  });
  return objectReferenceDiagnostics(checks, record, entitiesById);
}
