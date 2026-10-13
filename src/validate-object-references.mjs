import { validateHostReferences } from "./validate-host-references.mjs";
import { validateNetworkTargetReferences } from "./validate-network-target-references.mjs";
import { validateRoutingPeerReferences } from "./validate-routing-peer-references.mjs";

export function validateObjectReferences(record, entitiesById) {
  return [
    ...validateHostReferences(record, entitiesById),
    ...validateRoutingPeerReferences(record, entitiesById),
    ...validateNetworkTargetReferences(record, entitiesById),
  ];
}
