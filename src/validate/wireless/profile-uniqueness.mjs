import { createDiagnostic } from "../../diagnostics.mjs";

export function validateWirelessProfileUniqueness(record) {
  const diagnostics = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    const seen = new Set();
    (networkInterface.wireless?.profiles ?? []).forEach((profile, index) => {
      const id = profile.wirelessNetworkId;
      if (seen.has(id)) {
        diagnostics.push(
          createDiagnostic(
            record.file,
            `/interfaces/${interfaceIndex}/wireless/profiles/${index}`,
            record.data.id,
            "This profile repeats an earlier reference.",
            "Keep one profile for each unique reference.",
          ),
        );
        return;
      }
      seen.add(id);
    });
  });
  return diagnostics;
}
