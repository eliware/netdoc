import { objectReferenceDiagnostics } from "../../object-reference-diagnostics.mjs";

export function validateWirelessNetworkReferences(record, entitiesById) {
  const checks = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    const wireless = networkInterface.wireless ?? {};
    (wireless.broadcasts ?? []).forEach((broadcast, index) =>
      checks.push([
        broadcast.wirelessNetworkId,
        `/interfaces/${interfaceIndex}/wireless/broadcasts/${index}/wirelessNetworkId`,
        ["wireless-network"],
      ]),
    );
    (wireless.profiles ?? []).forEach((profile, index) =>
      checks.push([
        profile.wirelessNetworkId,
        `/interfaces/${interfaceIndex}/wireless/profiles/${index}/wirelessNetworkId`,
        ["wireless-network"],
      ]),
    );
  });
  return objectReferenceDiagnostics(checks, record, entitiesById);
}
