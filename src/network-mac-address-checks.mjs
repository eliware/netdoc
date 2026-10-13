import { createDiagnostic } from "./diagnostics.mjs";
import { normalizeMacAddress } from "./normalize-mac-address.mjs";

export function checkMac(networkInterface, record, pointer, segment, macs, diagnostics) {
  if (
    !networkInterface.macAddress ||
    networkInterface.segmentId === undefined ||
    segment?.kind !== "network-segment"
  )
    return;
  const normalized = normalizeMacAddress(networkInterface.macAddress);
  const key = `${networkInterface.segmentId}:${normalized}`;
  const previous = macs.get(key);
  if (previous)
    diagnostics.push(
      createDiagnostic(
        record.file,
        `${pointer}/macAddress`,
        record.data.id,
        `MAC address ${normalized} is already used at ${previous.file}#${previous.pointer}.`,
        "Use a unique MAC address on this segment.",
      ),
    );
  else macs.set(key, { file: record.file, pointer: `${pointer}/macAddress`, segment });
}
