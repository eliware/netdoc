import { createDiagnostic } from "../../diagnostics.mjs";

export function validateDnsNameDuplicates(record) {
  const diagnostics = [];
  (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
    (networkInterface.addresses ?? []).forEach((address, addressIndex) => {
      const seen = new Set();
      (address.dnsNames ?? []).forEach((dnsName, nameIndex) => {
        const normalized = dnsName.toLowerCase();
        if (seen.has(normalized)) {
          diagnostics.push(
            createDiagnostic(
              record.file,
              `/interfaces/${interfaceIndex}/addresses/${addressIndex}/dnsNames/${nameIndex}`,
              record.data.id,
              `DNS name '${dnsName}' repeats an earlier name for this address.`,
              "Keep one entry for each DNS name, regardless of letter case.",
            ),
          );
          return;
        }
        seen.add(normalized);
      });
    });
  });
  return diagnostics;
}
