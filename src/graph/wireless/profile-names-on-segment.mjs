export default function wirelessProfileNamesOnSegment(networkInterface, segmentId, context) {
  return (networkInterface.wireless?.profiles ?? [])
    .filter((profile) =>
      context?.wirelessSegmentIdsByNetworkId?.get(profile.wirelessNetworkId)?.has(segmentId),
    )
    .map(
      (profile) =>
        context.recordById.get(profile.wirelessNetworkId)?.data.name ?? "wireless network unknown",
    );
}
