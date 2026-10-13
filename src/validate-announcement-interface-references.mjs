import { createDiagnostic } from "./diagnostics.mjs";

export function validateAnnouncementInterfaceReferences(record, entitiesById) {
  const diagnostics = [];
  for (const [index, entry] of (record.data.networking?.l2Announcements ?? []).entries()) {
    const target = entitiesById.get(entry.nodeId);
    const names = new Set((target?.record.data.interfaces ?? []).map((item) => item.name));
    if (entry.interfaceName !== undefined && !names.has(entry.interfaceName))
      diagnostics.push(
        createDiagnostic(
          record.file,
          `/networking/l2Announcements/${index}/interfaceName`,
          record.data.id,
          `Interface name '${entry.interfaceName}' does not exist on the referenced object.`,
          "Use the name of an interface on the referenced object.",
        ),
      );
  }
  return diagnostics;
}
