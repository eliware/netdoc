import { edgeLine, nodeLine } from "../labels.mjs";

export function buildLoadBalancingElements(index, source, networking, context) {
  const nodes = [];
  const edges = [];
  (networking.loadBalancing?.listeners ?? []).forEach((listener, listenerIndex) => {
    const listenerNode = `listener_${index}_${listenerIndex}`;
    const label = ["Load balancer listener", `${listener.protocol}:${listener.port}`];
    if (listener.address !== undefined) label.push(`Address: ${listener.address}`);
    nodes.push(nodeLine(listenerNode, label));
    edges.push(edgeLine(source, listenerNode, "load balancer listener"));
    (listener.targets ?? []).forEach((target, targetIndex) => {
      const targetLabel = target.address
        ? `${target.address}${target.port === undefined ? "" : `:${target.port}`}`
        : `device ${target.deviceId}${target.port === undefined ? "" : ` port ${target.port}`}`;
      const targetNode = context.objectNodeById.get(target.deviceId);
      if (targetNode) {
        edges.push(edgeLine(listenerNode, targetNode, `target ${targetLabel}`));
        return;
      }
      const addressNode = `listener_target_${index}_${listenerIndex}_${targetIndex}`;
      nodes.push(nodeLine(addressNode, ["Load balancer target", targetLabel]));
      edges.push(edgeLine(listenerNode, addressNode, "target"));
    });
  });
  return { nodes, edges };
}
