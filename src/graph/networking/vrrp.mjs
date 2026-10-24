import { edgeLine, nodeLine } from "../labels.mjs";

export function buildVrrpElements(index, source, networking, context) {
  const nodes = [];
  const edges = [];
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
    const interfaces = context.records[index].data.interfaces ?? [];
    const interfaceIndex = interfaces.findIndex((item) => item.name === group.interfaceName);
    if (interfaceIndex !== -1)
      edges.push(edgeLine(target, `interface_${index}_${interfaceIndex}`, "uses interface"));
  });
  return { nodes, edges };
}
