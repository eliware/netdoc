import { edgeLine, nodeLine } from "../labels.mjs";

export function buildLoadBalancingTargetElements(
  index,
  listenerIndex,
  listenerNode,
  targets,
  context,
) {
  const nodes = [];
  const edges = [];
  targets.forEach((target, targetIndex) => {
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
  return { nodes, edges };
}
