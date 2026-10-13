import { createDiagnostic } from "./diagnostics.mjs";
import { validateLocalInterfaceNameFields } from "./validate-local-interface-name-fields.mjs";

export function validateInterfaceNameReferences(record) {
  const diagnostics = [];
  const interfaces = record.data.interfaces ?? [];
  const names = new Map(interfaces.map((item, index) => [item.name, index]));
  for (const [index, networkInterface] of interfaces.entries()) {
    if (names.get(networkInterface.name) !== index)
      diagnostics.push(
        createDiagnostic(
          record.file,
          `/interfaces/${index}/name`,
          record.data.id,
          "Interface name is duplicated.",
          "Give each interface a unique name within this record.",
        ),
      );
  }
  diagnostics.push(
    ...validateLocalInterfaceNameFields(
      interfaces.map((item, index) => [
        `/interfaces/${index}/parentInterface`,
        item.parentInterface,
      ]),
      record,
      new Set(names.keys()),
    ),
  );
  return diagnostics;
}
