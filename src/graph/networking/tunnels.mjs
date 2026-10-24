import { edgeLine, nodeLine } from "../labels.mjs";
import { findEndpointInterface } from "./endpoint-interfaces.mjs";

export function buildTunnelElements(index, source, networking, context) {
  const nodes = [];
  const edges = [];
  (networking.tunnels ?? []).forEach((tunnel, tunnelIndex) => {
    const tunnelNode = `tunnel_${index}_${tunnelIndex}`;
    nodes.push(
      nodeLine(tunnelNode, [
        `Configured ${tunnel.type ?? "tunnel"}`,
        `Local: ${tunnel.localAddress ?? "unknown"}`,
        `Listen port: ${tunnel.listenPort ?? "unknown"}`,
      ]),
    );
    edges.push(edgeLine(source, tunnelNode, "tunnel configuration", "-.->"));
    (tunnel.peers ?? []).forEach((peer, peerIndex) => {
      const peerNode = `tunnel_peer_${index}_${tunnelIndex}_${peerIndex}`;
      nodes.push(
        nodeLine(peerNode, [
          "Tunnel peer",
          `${peer.endpointAddress ?? "Endpoint unknown"}:${peer.endpointPort ?? "port unknown"}`,
          `Allowed networks: ${(peer.allowedNetworks ?? []).join(", ") || "unknown"}`,
        ]),
      );
      edges.push(edgeLine(tunnelNode, peerNode, "configured peer", "-.->"));
      const interfaceNode = findEndpointInterface(peer.endpointAddress, context);
      if (interfaceNode) edges.push(edgeLine(peerNode, interfaceNode, "known endpoint", "-.->"));
    });
  });
  return { nodes, edges };
}
