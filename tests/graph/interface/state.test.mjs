import { expect, test } from "@jest/globals";
import createGraphContext from "../../../src/graph/context.mjs";
import interfaceState from "../../../src/graph/interface/state.mjs";

test("marks missing segment and connection state as unknown", () => {
  expect(interfaceState({})).toEqual({ segmentUnknown: true, connectionUnknown: true });
});

test("resolves segments from direct links, broadcasts, and wireless profiles", () => {
  const records = [
    {
      data: {
        kind: "network-device",
        interfaces: [{ wireless: { broadcasts: [{ wirelessNetworkId: 10n, segmentId: 20n }] } }],
      },
    },
    { data: { kind: "wireless-network", id: 10n } },
  ];
  const context = createGraphContext(records);
  expect(interfaceState({ segmentId: 2n }, context).segmentUnknown).toBe(false);
  expect(
    interfaceState({ wireless: { broadcasts: [{ segmentId: 2n }] } }, context).segmentUnknown,
  ).toBe(false);
  expect(
    interfaceState({ wireless: { profiles: [{ wirelessNetworkId: 10n }] } }, context)
      .segmentUnknown,
  ).toBe(false);
});

test("marks known connection details as not unknown", () => {
  expect(interfaceState({ connectsTo: 1n }).connectionUnknown).toBe(false);
  expect(interfaceState({ externalPeer: "ISP" }).connectionUnknown).toBe(false);
  expect(interfaceState({ unused: true }).connectionUnknown).toBe(false);
});
