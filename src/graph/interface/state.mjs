import wirelessProfileSegments from "../wireless/profiles.mjs";

export default function interfaceState(networkInterface, context) {
  const broadcasts = networkInterface.wireless?.broadcasts ?? [];
  const profileSegments = wirelessProfileSegments(networkInterface, context);
  return {
    segmentUnknown:
      networkInterface.segmentId === undefined &&
      broadcasts.length === 0 &&
      profileSegments.size === 0,
    connectionUnknown:
      networkInterface.connectsTo === undefined &&
      !networkInterface.externalPeer &&
      !networkInterface.unused,
  };
}
