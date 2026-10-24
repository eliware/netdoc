import { nodeLine } from "./labels.mjs";
import { interfaceLabel, objectLabel } from "./inventory-labels.mjs";

export function buildInventoryNodes(context) {
  const lines = [];
  context.records.forEach((record, recordIndex) => {
    lines.push(nodeLine(`object_${recordIndex}`, objectLabel(record)));
    (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
      lines.push(
        nodeLine(`interface_${recordIndex}_${interfaceIndex}`, interfaceLabel(networkInterface)),
      );
    });
  });
  return lines;
}
