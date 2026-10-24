import { expect, test } from "@jest/globals";
import { validateWirelessBroadcastUniqueness } from "../../../src/validate/wireless/broadcast-uniqueness.mjs";

test("allows different broadcasts and reports repeated network-segment pairs", () => {
  const diagnostics = validateWirelessBroadcastUniqueness({
    file: "access-point.yaml",
    data: {
      id: 20n,
      interfaces: [
        {},
        {
          wireless: {
            broadcasts: [
              { wirelessNetworkId: 1n, segmentId: 2n },
              { wirelessNetworkId: 1n, segmentId: 3n },
              { wirelessNetworkId: 2n, segmentId: 2n },
              { wirelessNetworkId: 1n, segmentId: 2n },
            ],
          },
        },
      ],
    },
  });
  expect(diagnostics).toEqual([
    expect.objectContaining({ pointer: "/interfaces/1/wireless/broadcasts/3", objectId: 20n }),
  ]);
});
