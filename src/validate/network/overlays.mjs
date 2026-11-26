import validateOverlayEndpointReferences from "./overlays/endpoints.mjs";
import validateOverlaySegmentReferences from "./overlays/segments.mjs";

export default function validateOverlayReferences(record, entitiesById) {
  return [
    ...validateOverlaySegmentReferences(record, entitiesById),
    ...validateOverlayEndpointReferences(record, entitiesById),
  ];
}
