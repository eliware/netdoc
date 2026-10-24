import { validateNetworkSegmentReference } from "../network/segment-reference.mjs";
import { validateWirelessDeviceReferences } from "./device-references.mjs";
import { validateWirelessRoleReferences } from "./role-references.mjs";
import { validateWirelessNetworkReferences } from "./network-references.mjs";
import { validateWirelessReferenceUniqueness } from "./unique-references.mjs";

export function validateWirelessReferences(record, entitiesById) {
  const segmentChecks = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    (networkInterface.wireless?.broadcasts ?? []).forEach((broadcast, broadcastIndex) => {
      segmentChecks.push([
        broadcast.segmentId,
        `/interfaces/${interfaceIndex}/wireless/broadcasts/${broadcastIndex}/segmentId`,
      ]);
    });
  });
  return [
    ...validateWirelessNetworkReferences(record, entitiesById),
    ...validateWirelessDeviceReferences(record, entitiesById),
    ...validateWirelessRoleReferences(record, entitiesById),
    ...segmentChecks.flatMap(([id, pointer]) =>
      validateNetworkSegmentReference(id, record, pointer, entitiesById),
    ),
    ...validateWirelessReferenceUniqueness(record),
  ];
}
