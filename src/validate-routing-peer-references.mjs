import { objectReferenceDiagnostics } from "./object-reference-diagnostics.mjs";

export function validateRoutingPeerReferences(record, entitiesById) {
  const peers = record.data.networking?.routing?.bgp?.peers ?? [];
  const checks = peers.flatMap((peer, i) =>
    peer.peerId === undefined
      ? []
      : [
          [
            peer.peerId,
            `/networking/routing/bgp/peers/${i}/peerId`,
            ["physical-machine", "virtual-machine", "network-device"],
          ],
        ],
  );
  return objectReferenceDiagnostics(checks, record, entitiesById);
}
