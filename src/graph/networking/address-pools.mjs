import { edgeLine, nodeLine } from "../labels.mjs";

export function buildAddressPoolElements(index, source, pools) {
  const nodes = [];
  const edges = [];
  pools.forEach((pool, poolIndex) => {
    const range = pool.cidr ?? `${pool.start} - ${pool.end}`;
    const target = `address_pool_${index}_${poolIndex}`;
    nodes.push(nodeLine(target, ["Load balancer address pool", range]));
    edges.push(edgeLine(source, target, "address pool"));
  });
  return { nodes, edges };
}
