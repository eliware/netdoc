import { objectReferenceDiagnostics } from "../../object-reference-diagnostics.mjs";

export function validateWirelessDeviceReferences(record, entitiesById) {
  const checks = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    (networkInterface.wireless?.profiles ?? []).forEach((profile, index) => {
      if (profile.accessPointId === undefined) return;
      const pointer = `/interfaces/${interfaceIndex}/wireless/profiles/${index}/accessPointId`;
      checks.push([profile.accessPointId, pointer, ["network-device"]]);
    });
  });
  const controllerId = record.data.wirelessManagement?.controllerId;
  if (controllerId !== undefined) {
    const pointer = "/wirelessManagement/controllerId";
    const kinds = ["network-device", "virtual-machine"];
    checks.push([controllerId, pointer, kinds]);
  }
  return objectReferenceDiagnostics(checks, record, entitiesById);
}
