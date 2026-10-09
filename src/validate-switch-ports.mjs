import { createDiagnostic } from "./diagnostics.mjs";

export function validateSwitchPorts(records, entitiesById) {
  const diagnostics = [];
  for (const record of records) {
    const interfaces = new Map((record.data.interfaces ?? []).map((item) => [item.name, item]));
    for (const [index, port] of (record.data.switch?.ports ?? []).entries()) {
      const pointer = `/switch/ports/${index}`;
      const nic = interfaces.get(port.interfaceName);
      if (port.mode === "access") checkAccess(record, pointer, port, nic, diagnostics);
      if (port.mode === "trunk") checkTrunk(record, pointer, port, entitiesById, diagnostics);
    }
  }
  return diagnostics;
}

function checkAccess(record, pointer, port, nic, diagnostics) {
  if (nic?.segmentId !== undefined && nic.segmentId !== port.segmentId) {
    diagnostics.push(
      createDiagnostic(
        record.file,
        `${pointer}/segmentId`,
        record.data.id,
        "Access port and interface use different segments.",
        "Use the same segment ID on the access port and interface.",
      ),
    );
  }
}

function checkTrunk(record, pointer, port, entitiesById, diagnostics) {
  const tagged = port.segmentIds ?? [];
  for (const [index, id] of tagged.entries()) {
    const segment = entitiesById.get(id)?.record?.data;
    if (segment?.vlan === "untagged")
      diagnostics.push(
        createDiagnostic(
          record.file,
          `${pointer}/segmentIds/${index}`,
          record.data.id,
          `Trunk tagged segment ${id} has no VLAN tag.`,
          "Use a segment with a numeric VLAN ID for tagged traffic.",
        ),
      );
  }
  if (port.pvidSegmentId !== undefined && tagged.includes(port.pvidSegmentId)) {
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
