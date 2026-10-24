import { expect, test } from "@jest/globals";
import { indexWirelessBroadcastSegments } from "../../../src/graph/wireless/broadcast-segments.mjs";

test("indexes wireless broadcast segments by network ID", () => {
  const records = [
    { data: {} },
    { data: { interfaces: [{}, { wireless: {} }] } },
    {
      data: {
        interfaces: [
          {
            wireless: {
              broadcasts: [
                { wirelessNetworkId: 10n, segmentId: 20n },
                { wirelessNetworkId: 10n, segmentId: 21n },
              ],
            },
          },
          { wireless: { broadcasts: [{ wirelessNetworkId: 11n, segmentId: 22n }] } },
        ],
      },
    },
  ];

  const result = indexWirelessBroadcastSegments(records);

  expect([...result]).toEqual([
    [10n, new Set([20n, 21n])],
    [11n, new Set([22n])],
  ]);
});
