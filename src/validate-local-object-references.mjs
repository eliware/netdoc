import { validateAnnouncementInterfaceReferences } from "./validate-announcement-interface-references.mjs";
import { validateLocalSegmentReferences } from "./validate-local-segment-references.mjs";

export function validateLocalObjectReferences(record, entitiesById) {
  return [
    ...validateLocalSegmentReferences(record, entitiesById),
    ...validateAnnouncementInterfaceReferences(record, entitiesById),
  ];
}
