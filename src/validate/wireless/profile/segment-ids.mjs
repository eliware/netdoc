export default function wirelessProfileSegmentIds(networkInterface, entitiesById) {
  const wirelessNetworkIds = new Set(
    (networkInterface.wireless?.profiles ?? []).map(({ wirelessNetworkId }) => wirelessNetworkId),
  );
  const segmentIds = [];
  for (const entity of entitiesById?.values() ?? []) {
    for (const item of entity.record?.data.interfaces ?? []) {
      for (const broadcast of item.wireless?.broadcasts ?? []) {
        if (wirelessNetworkIds.has(broadcast.wirelessNetworkId))
          segmentIds.push(broadcast.segmentId);
      }
    }
  }
  return segmentIds;
}
