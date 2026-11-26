export default function collectNetworkingElements(context, builders) {
  const nodes = [];
  const edges = [];
  for (const [recordIndex, record] of context.records.entries()) {
    const source = context.objectNodeByRecord.get(record);
    const networking = record.data.networking ?? {};
    for (const buildElements of builders) {
      const elements = buildElements(recordIndex, source, networking, context);
      nodes.push(...elements.nodes);
      edges.push(...elements.edges);
    }
  }
  return { nodes, edges };
}
