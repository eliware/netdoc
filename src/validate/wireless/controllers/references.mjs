import objectReferenceDiagnostics from "../../../object-reference-diagnostics.mjs";

export default function validateWirelessControllerReferences(record, entitiesById) {
  const controllerId = record.data.wirelessManagement?.controllerId;
  if (controllerId === undefined) return [];
  return objectReferenceDiagnostics(
    [[controllerId, "/wirelessManagement/controllerId", ["network-device", "virtual-machine"]]],
    record,
    entitiesById,
  );
}
