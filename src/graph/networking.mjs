import { addressInNetwork } from "../network/address/membership.mjs";
import { edgeLine, nodeLine } from "./labels.mjs";

export function buildNetworkingElements(context) {
  const nodes = [];
  const edges = [];
  for (const [recordIndex, record] of context.records.entries()) {
    const objectNodeId = context.objectNodeByRecord.get(record);
    const networking = record.data.networking ?? {};
    addDefaultGateway(record, recordIndex, objectNodeId, networking, context, nodes, edges);
    addStaticRoutes(record, recordIndex, objectNodeId, networking, context, nodes, edges);
    addBgpPeers(recordIndex, objectNodeId, networking, context, nodes, edges);
    addVrrp(recordIndex, objectNodeId, networking, nodes, edges);
    addTunnels(recordIndex, objectNodeId, networking, nodes, edges);
  }
  return { nodes, edges };
}

function addDefaultGateway(record, index, source, networking, context, nodes, edges) {
  const address = networking.routing?.defaultGateway;
  if (!address) return;
  const segment = findSegment(context.records, (cidr) => addressInNetwork(address, cidr));
  if (segment) {
    edges.push(
      edgeLine(source, context.objectNodeByRecord.get(segment), `default gateway ${address}`),
    );
    return;
  }
  const target = `gateway_${index}`;
  nodes.push(nodeLine(target, ["Default gateway", address, "Segment unknown"]));
  edges.push(edgeLine(source, target, "default gateway"));
}

function addStaticRoutes(record, index, source, networking, context, nodes, edges) {
  (networking.routing?.staticRoutes ?? []).forEach((route, routeIndex) => {
    const segment = findSegment(context.records, (cidr) =>
      addressInNetwork(cidr, route.destination),
    );
    const via = route.nextHop ?? route.interfaceName ?? "unknown";
    if (segment) {
      edges.push(
        edgeLine(
          source,
          context.objectNodeByRecord.get(segment),
          `route ${route.destination} via ${via}`,
        ),
      );
      return;
    }
    const target = `route_${index}_${routeIndex}`;
    nodes.push(nodeLine(target, ["Static route", route.destination, `Next hop: ${via}`]));
    edges.push(edgeLine(source, target, "static route"));
  });
}

function addBgpPeers(index, source, networking, context, nodes, edges) {
  const bgp = networking.routing?.bgp;
  if (!bgp) return;
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
}

function addVrrp(index, source, networking, nodes, edges) {
  (networking.routing?.vrrp ?? []).forEach((group, groupIndex) => {
    const target = `vrrp_${index}_${groupIndex}`;
    nodes.push(
      nodeLine(target, [
        "Configured VRRP",
        `VRID ${group.vrid}`,
        ...(group.virtualAddresses ?? []),
      ]),
    );
    edges.push(edgeLine(source, target, group.interfaceName ?? "VRRP interface unknown"));
  });
}

function addTunnels(index, source, networking, nodes, edges) {
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
    });
  });
}

function findSegment(records, matchesNetwork) {
  return records.find(
    (record) =>
      record.data.kind === "network-segment" &&
      (record.data.ipNetworks ?? []).some(({ cidr }) => matchesNetwork(cidr)),
  );
}
