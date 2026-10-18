import { createDiagnostic } from "../../diagnostics.mjs";

export function validateLocalInterfaceNameFields(fields, record, names) {
  return fields.flatMap(([pointer, name]) => {
    if (name === undefined || names.has(name)) return [];
    return [
      createDiagnostic(
        record.file,
        pointer,
        record.data.id,
        `Interface name '${name}' does not exist in this record.`,
        "Use the name of an interface in this record.",
      ),
    ];
  });
}
