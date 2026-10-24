import { objectReferenceDiagnostics } from "../../object-reference-diagnostics.mjs";
import { validateWirelessRoles } from "./roles.mjs";

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

export function validateWirelessAccessPointRoles(record, entitiesById) {
  const checks = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    (networkInterface.wireless?.profiles ?? []).forEach((profile, index) => {
      if (profile.accessPointId === undefined) return;
      checks.push([
        profile.accessPointId,
        `/interfaces/${interfaceIndex}/wireless/profiles/${index}/accessPointId`,
        ["network-device"],
        "wireless-access-point",
      ]);
    });
  });
  return validateWirelessRoles(checks, record, entitiesById);
}
