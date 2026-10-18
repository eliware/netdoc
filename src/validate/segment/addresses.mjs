import { validateSegmentGateway } from "./gateway.mjs";
import { validateSegmentNetworkPrefix } from "./network-prefix.mjs";

export function validateSegmentAddresses(records) {
  const diagnostics = [];
  for (const record of records) {
    if (record.data.kind !== "network-segment") continue;
    for (const [index, network] of (record.data.ipNetworks ?? []).entries())
      diagnostics.push(
        ...validateSegmentNetworkPrefix(record, network, index),
        ...validateSegmentGateway(record, network, index),
      );
  }
  return diagnostics;
}
