export default function interfaceLabel(networkInterface, state) {
  const lines = [networkInterface.name ?? "Interface name unknown"];
  if (networkInterface.type) lines.push(networkInterface.type);
  if (networkInterface.macAddress) lines.push(`MAC: ${networkInterface.macAddress}`);
  const addresses = (networkInterface.addresses ?? []).map(({ cidr }) => cidr).filter(Boolean);
  if (addresses.length > 0) lines.push(`Address: ${addresses.join(", ")}`);
  if (state.segmentUnknown) lines.push("Segment unknown");
  if (state.connectionUnknown) lines.push("Connection unknown");
  if (networkInterface.externalPeer) lines.push(`External peer: ${networkInterface.externalPeer}`);
  if (networkInterface.unused) lines.push("Unused");
  return lines;
}
