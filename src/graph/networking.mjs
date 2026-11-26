import buildBgpElements from "./networking/bgp.mjs";
import buildRouteElements from "./networking/routes.mjs";
import buildTunnelElements from "./networking/tunnels.mjs";
import buildVrrpElements from "./networking/vrrp.mjs";
import buildLoadBalancingElements from "./networking/load-balancing.mjs";
import buildListenerElements from "./networking/listeners.mjs";
import collectNetworkingElements from "./networking/collector.mjs";

export default function buildNetworkingElements(context) {
  return collectNetworkingElements(context, [
    buildRouteElements,
    buildBgpElements,
    buildVrrpElements,
    buildTunnelElements,
    buildListenerElements,
    buildLoadBalancingElements,
  ]);
}
