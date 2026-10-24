import { createDiagnostic } from "../../diagnostics.mjs";

export function validateWirelessBroadcastUniqueness(record) {
  const diagnostics = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    const seen = new Set();
    (networkInterface.wireless?.broadcasts ?? []).forEach((broadcast, index) => {
      const key = `${broadcast.wirelessNetworkId}:${broadcast.segmentId}`;
      if (seen.has(key)) {
        diagnostics.push(
          createDiagnostic(
            record.file,
            `/interfaces/${interfaceIndex}/wireless/broadcasts/${index}`,
            record.data.id,
            "This broadcast repeats an earlier reference.",
            "Keep one broadcast for each unique reference.",
          ),
        );
        return;
      }
      seen.add(key);
    });
  });
  return diagnostics;
}
