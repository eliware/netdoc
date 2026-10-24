export function objectLabel(record) {
  const lines = [record.data.kind, record.data.name];
  if (record.data.kind === "network-segment") {
    lines.push(`VLAN: ${record.data.vlan ?? "unknown"}`);
    for (const network of record.data.ipNetworks ?? []) lines.push(network.cidr);
  }
  return lines;
}

export function interfaceLabel(networkInterface) {
  const lines = [networkInterface.name ?? "Interface name unknown"];
  if (networkInterface.type) lines.push(networkInterface.type);
  if (networkInterface.macAddress) lines.push(`MAC: ${networkInterface.macAddress}`);
  const addresses = (networkInterface.addresses ?? []).map(({ cidr }) => cidr).filter(Boolean);
  if (addresses.length > 0) lines.push(`Address: ${addresses.join(", ")}`);
  if (
    networkInterface.segmentId === undefined &&
    !(networkInterface.wireless?.broadcasts ?? []).length
  )
    lines.push("Segment unknown");
  if (
    networkInterface.connectsTo === undefined &&
    !networkInterface.externalPeer &&
    !networkInterface.unused
  )
    lines.push("Connection unknown");
  if (networkInterface.externalPeer) lines.push(`External peer: ${networkInterface.externalPeer}`);
  if (networkInterface.unused) lines.push("Unused");
  return lines;
}

export function segmentLabel(networkInterface, segmentId, context) {
  const labels = [networkInterface.name ?? "Interface"];
  for (const broadcast of networkInterface.wireless?.broadcasts ?? []) {
    if (broadcast.segmentId === segmentId) {
      const wirelessNetwork = context.recordById.get(broadcast.wirelessNetworkId);
      labels.push(`broadcast ${wirelessNetwork?.data.name ?? "wireless network unknown"}`);
    }
  }
  const addresses = (networkInterface.addresses ?? []).map(({ cidr }) => cidr).filter(Boolean);
  if (addresses.length > 0) labels.push(addresses.join(", "));
  return labels.join(" / ");
}
