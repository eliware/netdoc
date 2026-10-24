import { validateNetworkSegmentReference } from "../../../network/segment-reference.mjs";
import { switchPortSegmentFields } from "./fields.mjs";

export function validateSwitchPortSegmentReferences(record, entitiesById) {
  return switchPortSegmentFields(record).flatMap(([pointer, id]) =>
    validateNetworkSegmentReference(id, record, pointer, entitiesById),
  );
}
