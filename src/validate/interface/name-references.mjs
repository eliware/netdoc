import { validateLocalInterfaceNameFields } from "../local/interface-name-fields.mjs";

export function validateInterfaceNameReferences(record) {
  const interfaces = record.data.interfaces ?? [];
  const names = new Set(interfaces.map((item) => item.name));
  return validateLocalInterfaceNameFields(
    interfaces.map((item, index) => [`/interfaces/${index}/parentInterface`, item.parentInterface]),
    record,
    names,
  );
}
