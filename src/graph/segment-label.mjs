import wirelessProfileNamesOnSegment from "./wireless/profile-names-on-segment.mjs";

export default function segmentLabel(networkInterface, segmentId, context) {
  const labels = [networkInterface.name ?? "Interface"];
  for (const broadcast of networkInterface.wireless?.broadcasts ?? []) {
    if (broadcast.segmentId === segmentId) {
      const wirelessNetwork = context.recordById.get(broadcast.wirelessNetworkId);
      labels.push(`broadcast ${wirelessNetwork?.data.name ?? "wireless network unknown"}`);
    }
  }
  for (const name of wirelessProfileNamesOnSegment(networkInterface, segmentId, context)) {
    labels.push(`profile ${name}`);
  }
  const addresses = (networkInterface.addresses ?? []).map(({ cidr }) => cidr).filter(Boolean);
  if (addresses.length > 0) labels.push(addresses.join(", "));
  return labels.join(" / ");
}
