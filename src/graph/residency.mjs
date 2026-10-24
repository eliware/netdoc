import { edgeLine } from "./labels.mjs";

export function buildResidencyEdges(context) {
  const edges = [];
  for (const record of context.records) {
    const child = context.objectNodeByRecord.get(record);
    const residentIds =
      record.data.kind === "virtual-machine"
        ? [record.data.residentOn]
        : record.data.kind === "network-device"
          ? (record.data.residentOn ?? [])
          : [];
    for (const residentId of residentIds) {
      const host = context.objectNodeById.get(residentId);
      if (host) edges.push(edgeLine(child, host, "runs on", "-.->"));
    }
  }
  return edges;
}
