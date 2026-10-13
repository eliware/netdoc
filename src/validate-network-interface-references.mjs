import { localInterfaceFields } from "./local-interface-fields.mjs";
import { validateLocalInterfaceNameFields } from "./validate-local-interface-name-fields.mjs";

export function validateNetworkInterfaceReferences(record) {
  const names = new Set((record.data.interfaces ?? []).map(({ name }) => name));
  return validateLocalInterfaceNameFields(localInterfaceFields(record.data), record, names);
}
