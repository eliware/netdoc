import { objectReferenceDiagnostics } from "../../object-reference-diagnostics.mjs";
import { validateWirelessRoles } from "./roles.mjs";

export function validateWirelessDeviceReferences(record, entitiesById) {
  const checks = [];
  const roleChecks = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    (networkInterface.wireless?.profiles ?? []).forEach((profile, index) => {
      if (profile.accessPointId === undefined) return;
      const pointer = `/interfaces/${interfaceIndex}/wireless/profiles/${index}/accessPointId`;
      checks.push([profile.accessPointId, pointer, ["network-device"]]);
      roleChecks.push([
        profile.accessPointId,
        pointer,
        ["network-device"],
        "wireless-access-point",
      ]);
    });
  });
  const controllerId = record.data.wirelessManagement?.controllerId;
  if (controllerId !== undefined) {
    const pointer = "/wirelessManagement/controllerId";
    const kinds = ["network-device", "virtual-machine"];
    checks.push([controllerId, pointer, kinds]);
    roleChecks.push([controllerId, pointer, kinds, "wireless-controller"]);
  }
  return [
    ...objectReferenceDiagnostics(checks, record, entitiesById),
    ...validateWirelessRoles(roleChecks, record, entitiesById),
  ];
}
