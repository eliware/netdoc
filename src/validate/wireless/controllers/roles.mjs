import { validateWirelessRoles } from "../roles.mjs";

export function validateWirelessControllerRoles(record, entitiesById) {
  const controllerId = record.data.wirelessManagement?.controllerId;
  if (controllerId === undefined) return [];
  return validateWirelessRoles(
    [
      [
        controllerId,
        "/wirelessManagement/controllerId",
        ["network-device", "virtual-machine"],
        "wireless-controller",
      ],
    ],
    record,
    entitiesById,
  );
}
