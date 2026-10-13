import { createDiagnostic } from "./diagnostics.mjs";

export function validateTrunkSwitchPorts(records, entitiesById) {
  const diagnostics = [];
  for (const record of records) {
    for (const [index, port] of (record.data.switch?.ports ?? []).entries()) {
      if (port.mode !== "trunk") continue;
      const pointer = `/switch/ports/${index}`;
      const tagged = port.segmentIds ?? [];
      for (const [segmentIndex, id] of tagged.entries()) {
        const target = entitiesById.get(id);
        if (target?.invalid) continue;
        const segment = target?.record?.data;
        if (segment?.vlan === "untagged")
          diagnostics.push(
            createDiagnostic(
              record.file,
              `${pointer}/segmentIds/${segmentIndex}`,
              record.data.id,
              `Trunk tagged segment ${id} has no VLAN tag.`,
              "Use a segment with a numeric VLAN ID for tagged traffic.",
            ),
          );
      }
      if (port.pvidSegmentId !== undefined && tagged.includes(port.pvidSegmentId))
        diagnostics.push(
          createDiagnostic(
            record.file,
            `${pointer}/pvidSegmentId`,
            record.data.id,
            "The PVID segment is also listed as tagged.",
            "Remove the PVID segment from the tagged segment list.",
          ),
        );
    }
  }
  return diagnostics;
}
