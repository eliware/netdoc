export default function wirelessProfileSegments(networkInterface, context) {
  const segmentIds = new Set();
  for (const profile of networkInterface.wireless?.profiles ?? []) {
    for (const segmentId of context?.wirelessSegmentIdsByNetworkId?.get(
      profile.wirelessNetworkId,
    ) ?? []) {
      segmentIds.add(segmentId);
    }
  }
  return segmentIds;
}
