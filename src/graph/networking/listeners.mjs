import edgeLine from "../edge-line.mjs";
import nodeLine from "../node-line.mjs";

export default function buildListenerElements(index, source, networking) {
  const nodes = [];
  const edges = [];
  (networking.listeners ?? []).forEach((listener, listenerIndex) => {
    const listenerNode = `service_listener_${index}_${listenerIndex}`;
    const label = [
      listener.label ?? "Configured listener",
      `${listener.protocol}:${listener.port}`,
    ];
    if (listener.address !== undefined) label.push(`Address: ${listener.address}`);
    nodes.push(nodeLine(listenerNode, label));
    edges.push(edgeLine(source, listenerNode, "listener"));
  });
  return { nodes, edges };
}
