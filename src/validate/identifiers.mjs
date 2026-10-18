import { createDiagnostic } from "../diagnostics.mjs";

const maximumId = 9223372036854775807n;

export function validateIdentifiers(records) {
  const previousIds = new Map();
  const diagnostics = [];
  for (const record of records) {
    const objectId = record.data.id;
    if (objectId !== undefined) {
      addIdentifier(objectId, record, "/id", previousIds, diagnostics);
    }
    (record.data.interfaces ?? []).forEach((networkInterface, index) => {
      if (networkInterface.id !== undefined) {
        addIdentifier(
          networkInterface.id,
          record,
          `/interfaces/${index}/id`,
          previousIds,
          diagnostics,
        );
      }
    });
  }
  return diagnostics;
}

function addIdentifier(id, record, pointer, previousIds, diagnostics) {
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
  const previous = previousIds.get(id);
  if (previous) {
    diagnostics.push(
      createDiagnostic(
        location.file,
        location.pointer,
        location.objectId,
        `This ID is in use at ${previous.file}#${previous.pointer}.`,
        "Supply a new ID and update references to the intended object.",
      ),
    );
    return;
  }
  previousIds.set(id, { file: record.file, pointer });
}
