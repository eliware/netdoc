import { validateHostReferences } from "./host-references.mjs";
import { validateNetworkTargetReferences } from "./network/target-references.mjs";
import { validateRoutingPeerReferences } from "./routing-peer-references.mjs";
import { validateAnnouncementInterfaceReferences } from "./announcement-interface-references.mjs";
import { validateWirelessReferences } from "./wireless/references.mjs";
import { validateOverlayReferences } from "./network/overlays.mjs";

export function validateObjectReferences(record, entitiesById) {
  return [
    ...validateAnnouncementInterfaceReferences(record, entitiesById),
    ...validateWirelessReferences(record, entitiesById),
    ...validateHostReferences(record, entitiesById),
    ...validateRoutingPeerReferences(record, entitiesById),
    ...validateNetworkTargetReferences(record, entitiesById),
    ...validateOverlayReferences(record, entitiesById),
  ];
}
