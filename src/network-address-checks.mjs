import { createDiagnostic } from "./diagnostics.mjs";
import { addressInNetwork, parseAddress } from "./ip-addresses.mjs";

export function checkMac(networkInterface, record, pointer, segment, macs, diagnostics) {
  if (!networkInterface.macAddress || networkInterface.segmentId === undefined) return;
  const normalized = networkInterface.macAddress.toLowerCase().replaceAll("-", ":");
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

export function checkSegmentAddresses(record, diagnostics) {
  if (record.data.kind !== "network-segment") return;
  for (const [index, network] of (record.data.ipNetworks ?? []).entries()) {
    if (!parseAddress(network.cidr))
      diagnostics.push(
        createDiagnostic(
          record.file,
          `/ipNetworks/${index}/cidr`,
          record.data.id,
          `Invalid network prefix '${network.cidr}'.`,
          "Use a valid IP network with a prefix length.",
        ),
      );
    if (network.gateway && !addressInNetwork(network.gateway, network.cidr))
      diagnostics.push(
        createDiagnostic(
          record.file,
          `/ipNetworks/${index}/gateway`,
          record.data.id,
          `Gateway ${network.gateway} is outside network ${network.cidr}.`,
          "Use a gateway address inside this network.",
        ),
      );
  }
}
