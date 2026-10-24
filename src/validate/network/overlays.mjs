import { validateOverlayEndpointReferences } from "./overlays/endpoints.mjs";
import { validateOverlaySegmentReferences } from "./overlays/segments.mjs";

export function validateOverlayReferences(record, entitiesById) {
  return [
    ...validateOverlaySegmentReferences(record, entitiesById),
    ...validateOverlayEndpointReferences(record, entitiesById),
  ];
}
