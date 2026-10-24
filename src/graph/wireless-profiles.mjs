export function wirelessProfileSegments(networkInterface, context) {
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

export function wirelessProfileNamesOnSegment(networkInterface, segmentId, context) {
  return (networkInterface.wireless?.profiles ?? [])
    .filter((profile) =>
      context?.wirelessSegmentIdsByNetworkId?.get(profile.wirelessNetworkId)?.has(segmentId),
    )
    .map(
      (profile) =>
        context.recordById.get(profile.wirelessNetworkId)?.data.name ?? "wireless network unknown",
    );
}
