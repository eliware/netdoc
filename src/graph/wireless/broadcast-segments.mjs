export function indexWirelessBroadcastSegments(records) {
  const segmentIdsByNetworkId = new Map();
  for (const record of records) {
    for (const networkInterface of record.data.interfaces ?? []) {
      for (const broadcast of networkInterface.wireless?.broadcasts ?? []) {
        const segmentIds = segmentIdsByNetworkId.get(broadcast.wirelessNetworkId) ?? new Set();
        segmentIds.add(broadcast.segmentId);
        segmentIdsByNetworkId.set(broadcast.wirelessNetworkId, segmentIds);
      }
    }
  }
  return segmentIdsByNetworkId;
}
