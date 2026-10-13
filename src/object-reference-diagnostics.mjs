import { createDiagnostic } from "./diagnostics.mjs";

export function objectReferenceDiagnostics(checks, record, entitiesById) {
  return checks.flatMap(([id, pointer, expected]) => {
    const target = entitiesById.get(id);
    if (target?.invalid) return [];
    if (target && expected.includes(target.kind)) return [];
    const actual = target?.kind ?? "no object";
    return [
      createDiagnostic(
        record.file,
        pointer,
        record.data.id,
        `Reference ${id} resolves to ${actual}; expected ${expected.join(" or ")}.`,
        "Use the ID of an existing object of the required type.",
      ),
    ];
  });
}
