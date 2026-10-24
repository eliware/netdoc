import { edgeLine } from "./labels.mjs";

export function buildInterfaceEdges(context) {
  const edges = [];
  for (const [recordIndex, record] of context.records.entries()) {
    for (const [interfaceIndex, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const interfaceNodeId = `interface_${recordIndex}_${interfaceIndex}`;
      const objectNodeId = context.objectNodeByRecord.get(record);
      edges.push(edgeLine(objectNodeId, interfaceNodeId, "interface", "-.->"));
      for (const segmentId of segmentIds(networkInterface)) {
        const segmentNodeId = context.objectNodeById.get(segmentId);
        if (segmentNodeId)
          edges.push(
            edgeLine(
              interfaceNodeId,
              segmentNodeId,
              segmentLabel(networkInterface, segmentId, context),
            ),
          );
      }
      const peerId = networkInterface.connectsTo;
      if (peerId === undefined) continue;
      const peer = context.interfaceById.get(peerId);
      if (!peer) continue;
      const key = [interfaceNodeId, peer.nodeId].sort().join(":");
      if (context.connectionKeys.has(key)) continue;
      context.connectionKeys.add(key);
      edges.push(
        edgeLine(
          interfaceNodeId,
          peer.nodeId,
          `${networkInterface.name} ↔ ${peer.networkInterface.name}`,
          "---",
        ),
      );
    }
  }
  for (const record of context.records) {
    const child = context.objectNodeByRecord.get(record);
    const residentIds =
      record.data.kind === "virtual-machine"
        ? [record.data.residentOn]
        : record.data.kind === "network-device"
          ? (record.data.residentOn ?? [])
          : [];
    for (const residentId of residentIds) {
      const host = context.objectNodeById.get(residentId);
      if (host) edges.push(edgeLine(child, host, "runs on", "-.->"));
    }
  }
  return edges;
}

function segmentIds(networkInterface) {
  return new Set([
    networkInterface.segmentId,
    ...(networkInterface.wireless?.broadcasts ?? []).map(({ segmentId }) => segmentId),
  ]);
}

function segmentLabel(networkInterface, segmentId, context) {
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
