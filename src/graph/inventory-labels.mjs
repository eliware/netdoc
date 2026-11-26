function objectLabel(record) {
  const lines = [record.data.kind, record.data.name];
  if (record.data.kind === "network-segment") {
    lines.push(`VLAN: ${record.data.vlan ?? "unknown"}`);
    for (const network of record.data.ipNetworks ?? []) lines.push(network.cidr);
  }
  return lines;
}

export default objectLabel;
