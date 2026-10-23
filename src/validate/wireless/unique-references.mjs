import { createDiagnostic } from "../../diagnostics.mjs";

export function validateWirelessReferenceUniqueness(record) {
  const diagnostics = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    const wireless = networkInterface.wireless ?? {};
    addDuplicates(
      wireless.profiles ?? [],
      (profile) => profile.wirelessNetworkId,
      `/interfaces/${interfaceIndex}/wireless/profiles`,
      "profile",
      record,
      diagnostics,
    );
    addDuplicates(
      wireless.broadcasts ?? [],
      (broadcast) => `${broadcast.wirelessNetworkId}:${broadcast.segmentId}`,
      `/interfaces/${interfaceIndex}/wireless/broadcasts`,
      "broadcast",
      record,
      diagnostics,
    );
  });
  return diagnostics;
}

function addDuplicates(items, keyFor, pointer, label, record, diagnostics) {
  const seen = new Set();
  items.forEach((item, index) => {
    const key = keyFor(item);
    if (seen.has(key)) {
      diagnostics.push(
        createDiagnostic(
          record.file,
          `${pointer}/${index}`,
          record.data.id,
          `This ${label} repeats an earlier reference.`,
          `Keep one ${label} for each unique reference.`,
        ),
      );
      return;
    }
    seen.add(key);
  });
}
