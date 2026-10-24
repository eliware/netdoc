import { edgeLine, nodeLine } from "../labels.mjs";
import { buildLoadBalancingTargetElements } from "./targets.mjs";

export function buildLoadBalancingElements(index, source, networking, context) {
  const nodes = [];
  const edges = [];
  (networking.loadBalancing?.listeners ?? []).forEach((listener, listenerIndex) => {
    const listenerNode = `listener_${index}_${listenerIndex}`;
    const label = ["Load balancer listener", `${listener.protocol}:${listener.port}`];
    if (listener.address !== undefined) label.push(`Address: ${listener.address}`);
    nodes.push(nodeLine(listenerNode, label));
    edges.push(edgeLine(source, listenerNode, "load balancer listener"));
    const targetElements = buildLoadBalancingTargetElements(
      index,
      listenerIndex,
      listenerNode,
      listener.targets ?? [],
      context,
    );
    nodes.push(...targetElements.nodes);
    edges.push(...targetElements.edges);
  });
  return { nodes, edges };
}
