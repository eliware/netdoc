export function escapeMermaidText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")
    .replace(/[\r\n]+/g, " ");
}

export function nodeLine(nodeId, label) {
  return `${nodeId}["${label.map(escapeMermaidText).join("<br/>")}"]`;
}

export function edgeLine(from, to, label, arrow = "-->") {
  return `${from} ${arrow}|${escapeMermaidText(label)}| ${to}`;
}

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
