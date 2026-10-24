import { validateWirelessRoles } from "../roles.mjs";

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
