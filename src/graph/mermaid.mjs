import { createGraphContext } from "./context.mjs";
import { buildInterfaceEdges } from "./interfaces.mjs";
import { buildInventoryNodes } from "./nodes.mjs";
import { buildNetworkingElements } from "./networking.mjs";

export function renderMermaidGraph(records) {
  const context = createGraphContext(records);
  const network = buildNetworkingElements(context);
  const lines = [
    "flowchart LR",
    ...buildInventoryNodes(context),
    ...network.nodes,
    ...buildInterfaceEdges(context),
    ...network.edges,
  ];
  return lines.join("\n");
}
