import { createGraphContext } from "./context.mjs";
import { buildInterfaceEdges } from "./interfaces.mjs";
import { buildInventoryNodes } from "./nodes.mjs";
import { buildNetworkingElements } from "./networking.mjs";
import { buildResidencyEdges } from "./residency.mjs";

export function renderMermaidGraph(records) {
  const context = createGraphContext(records);
  const network = buildNetworkingElements(context);
  const lines = [
    "flowchart LR",
    ...buildInventoryNodes(context),
    ...network.nodes,
    ...buildInterfaceEdges(context),
    ...buildResidencyEdges(context),
    ...network.edges,
  ];
  return lines.join("\n");
}
