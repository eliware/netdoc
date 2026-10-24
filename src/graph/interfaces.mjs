import { edgeLine } from "./labels.mjs";
import { segmentLabel } from "./inventory-labels.mjs";
import { wirelessProfileSegments } from "./wireless-profiles.mjs";

export function buildInterfaceEdges(context) {
  const edges = [];
  for (const [recordIndex, record] of context.records.entries()) {
    for (const [interfaceIndex, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const interfaceNodeId = `interface_${recordIndex}_${interfaceIndex}`;
      const objectNodeId = context.objectNodeByRecord.get(record);
      edges.push(edgeLine(objectNodeId, interfaceNodeId, "interface", "-.->"));
      for (const segmentId of segmentIds(networkInterface, context)) {
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
  return edges;
}

function segmentIds(networkInterface, context) {
  return new Set([
    networkInterface.segmentId,
    ...(networkInterface.wireless?.broadcasts ?? []).map(({ segmentId }) => segmentId),
    ...wirelessProfileSegments(networkInterface, context),
  ]);
}
