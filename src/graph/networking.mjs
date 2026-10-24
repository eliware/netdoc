import { buildBgpElements } from "./networking/bgp.mjs";
import { buildRouteElements } from "./networking/routes.mjs";
import { buildTunnelElements } from "./networking/tunnels.mjs";
import { buildVrrpElements } from "./networking/vrrp.mjs";
import { buildLoadBalancingElements } from "./networking/load-balancing.mjs";
import { buildListenerElements } from "./networking/listeners.mjs";

export function buildNetworkingElements(context) {
  const nodes = [];
  const edges = [];
  for (const [recordIndex, record] of context.records.entries()) {
    const source = context.objectNodeByRecord.get(record);
    const networking = record.data.networking ?? {};
    for (const buildElements of [
      buildRouteElements,
      buildBgpElements,
      buildVrrpElements,
      buildTunnelElements,
      buildListenerElements,
      buildLoadBalancingElements,
    ]) {
      const elements = buildElements(recordIndex, source, networking, context);
      nodes.push(...elements.nodes);
      edges.push(...elements.edges);
    }
  }
  return { nodes, edges };
}
