import { objectReferenceDiagnostics } from "../../../object-reference-diagnostics.mjs";

export function validateWirelessControllerReferences(record, entitiesById) {
  const controllerId = record.data.wirelessManagement?.controllerId;
  if (controllerId === undefined) return [];
  return objectReferenceDiagnostics(
    [[controllerId, "/wirelessManagement/controllerId", ["network-device", "virtual-machine"]]],
    record,
    entitiesById,
  );
}
