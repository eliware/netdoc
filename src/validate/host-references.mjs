import { objectReferenceDiagnostics } from "../object-reference-diagnostics.mjs";

export function validateHostReferences(record, entitiesById) {
  const { data } = record;
  const checks = [];
  if (data.kind === "virtual-machine")
    checks.push([data.residentOn, "/residentOn", ["physical-machine"]]);
  if (data.kind === "network-device")
    (data.residentOn ?? []).forEach((id, i) =>
      checks.push([id, `/residentOn/${i}`, ["physical-machine", "virtual-machine"]]),
    );
  return objectReferenceDiagnostics(checks, record, entitiesById);
}
