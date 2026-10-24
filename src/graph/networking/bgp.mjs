import { edgeLine, nodeLine } from "../labels.mjs";

export function buildBgpElements(index, source, networking, context) {
  const nodes = [];
  const edges = [];
  const bgp = networking.routing?.bgp;
  if (!bgp) return { nodes, edges };
  (bgp.peers ?? []).forEach((peer, peerIndex) => {
    const label = `BGP AS ${bgp.localAs ?? "unknown"} to ${peer.remoteAs ?? "unknown"}`;
    const target = context.objectNodeById.get(peer.peerId);
    if (target) {
      edges.push(edgeLine(source, target, `${label} / ${peer.address}`));
      return;
    }
    const peerNode = `bgp_peer_${index}_${peerIndex}`;
    nodes.push(nodeLine(peerNode, ["BGP peer", peer.address ?? "Address unknown", label]));
    edges.push(edgeLine(source, peerNode, "BGP peer"));
  });
  return { nodes, edges };
}
