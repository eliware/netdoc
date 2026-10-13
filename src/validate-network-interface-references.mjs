import { localInterfaceFields } from "./local-interface-fields.mjs";
import { validateLocalInterfaceNameFields } from "./validate-local-interface-name-fields.mjs";

export function validateNetworkInterfaceReferences(record) {
  const names = new Set((record.data.interfaces ?? []).map(({ name }) => name));
  const fields = localInterfaceFields(record.data).filter(
    ([pointer]) => !pointer.startsWith("/networking/l2Announcements/"),
  );
  return validateLocalInterfaceNameFields(fields, record, names);
}
