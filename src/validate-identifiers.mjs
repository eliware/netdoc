import { createDiagnostic } from "./diagnostics.mjs";

const maximumId = 9223372036854775807n;

export function validateIdentifiers(records) {
  const entitiesById = new Map();
  const diagnostics = [];
  for (const record of records) {
    const objectId = record.data.id;
    if (objectId !== undefined) {
      addIdentifier(
        objectId,
        record,
        "/id",
        record.data.kind,
        undefined,
        entitiesById,
        diagnostics,
      );
    }
    (record.data.interfaces ?? []).forEach((networkInterface, index) => {
      if (networkInterface.id !== undefined) {
        addIdentifier(
          networkInterface.id,
          record,
          `/interfaces/${index}/id`,
          "interface",
          networkInterface,
          entitiesById,
          diagnostics,
        );
      }
    });
  }
  return { entitiesById, diagnostics };
}

function addIdentifier(id, record, pointer, kind, networkInterface, entitiesById, diagnostics) {
  if (typeof id !== "bigint") return;
  const location = { file: record.file, pointer, objectId: id };
  if (id < 1n || id > maximumId) {
    diagnostics.push(
      createDiagnostic(
        location.file,
        location.pointer,
        location.objectId,
        "The ID is outside the positive signed 64-bit range.",
        "Use an integer from 1 through 9223372036854775807.",
      ),
    );
    return;
  }
  const previous = entitiesById.get(id);
  if (previous) {
    diagnostics.push(
      createDiagnostic(
        location.file,
        location.pointer,
        location.objectId,
        `This ID is already used at ${previous.file}#${previous.pointer}.`,
        "Generate a new ID and update references to the intended object.",
      ),
    );
    return;
  }
  entitiesById.set(id, { file: record.file, pointer, kind, record, networkInterface });
}
