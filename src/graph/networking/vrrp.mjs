import { edgeLine, nodeLine } from "../labels.mjs";

export function buildVrrpElements(index, source, networking) {
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
  });
  return { nodes, edges };
}
