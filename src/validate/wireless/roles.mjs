import { createDiagnostic } from "../../diagnostics.mjs";

export function validateWirelessRoles(checks, record, entitiesById) {
  return checks.flatMap(([id, pointer, kinds, role]) => {
    const target = entitiesById.get(id);
    if (
      !target ||
      target.invalid ||
      !kinds.includes(target.kind) ||
      target.record.data.roles?.includes(role)
    )
      return [];
    return [
      createDiagnostic(
        record.file,
        pointer,
        record.data.id,
        `Reference ${id} does not have the '${role}' role.`,
        `Use the ID of an object with the '${role}' role.`,
      ),
    ];
  });
}
