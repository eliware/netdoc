import { validateWirelessRoles } from "./roles.mjs";

export function validateWirelessRoleReferences(record, entitiesById) {
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
  const controllerId = record.data.wirelessManagement?.controllerId;
  if (controllerId !== undefined)
    checks.push([
      controllerId,
      "/wirelessManagement/controllerId",
      ["network-device", "virtual-machine"],
      "wireless-controller",
    ]);
  return validateWirelessRoles(checks, record, entitiesById);
}
