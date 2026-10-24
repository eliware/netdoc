import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../src/graph/context.mjs";
import {
  wirelessProfileNamesOnSegment,
  wirelessProfileSegments,
} from "../../src/graph/wireless-profiles.mjs";

test("maps wireless profiles to advertised segments and names", () => {
  const clientInterface = {
    wireless: {
      profiles: [
        { wirelessNetworkId: 10n },
        { wirelessNetworkId: 11n },
        { wirelessNetworkId: 12n },
        { wirelessNetworkId: 13n },
      ],
    },
  };
  const records = [
    {
      data: {
        kind: "network-device",
        interfaces: [
          {
            wireless: {
              broadcasts: [
                { wirelessNetworkId: 10n, segmentId: 20n },
                { wirelessNetworkId: 10n, segmentId: 21n },
                { wirelessNetworkId: 11n, segmentId: 20n },
                { wirelessNetworkId: 12n, segmentId: 22n },
                { wirelessNetworkId: 13n, segmentId: 20n },
              ],
            },
          },
        ],
      },
    },
    { data: { kind: "wireless-network", id: 10n, name: "private5" } },
    { data: { kind: "wireless-network", id: 11n, name: "guest" } },
  ];
  const context = createGraphContext(records);

  expect([...wirelessProfileSegments(clientInterface, context)]).toEqual([20n, 21n, 22n]);
  expect(wirelessProfileNamesOnSegment(clientInterface, 20n, context)).toEqual([
    "private5",
    "guest",
    "wireless network unknown",
  ]);
  expect(wirelessProfileNamesOnSegment(clientInterface, 99n, context)).toEqual([]);
  expect(wirelessProfileSegments({}, context)).toEqual(new Set());
  expect(wirelessProfileSegments(clientInterface)).toEqual(new Set());
  expect(wirelessProfileNamesOnSegment(clientInterface, 20n)).toEqual([]);
});
