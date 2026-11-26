import { expect, test } from "@jest/globals";
import createGraphContext from "../../../src/graph/context.mjs";
import wirelessProfileNamesOnSegment from "../../../src/graph/wireless/profile-names-on-segment.mjs";

test("maps wireless profiles to names advertised on a segment", () => {
  const clientInterface = {
    wireless: {
      profiles: [
        { wirelessNetworkId: 10n },
        { wirelessNetworkId: 11n },
        { wirelessNetworkId: 12n },
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
                { wirelessNetworkId: 11n, segmentId: 20n },
                { wirelessNetworkId: 12n, segmentId: 20n },
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
  expect(wirelessProfileNamesOnSegment(clientInterface, 20n, context)).toEqual([
    "private5",
    "guest",
    "wireless network unknown",
  ]);
  expect(wirelessProfileNamesOnSegment(clientInterface, 99n, context)).toEqual([]);
  expect(wirelessProfileNamesOnSegment({}, 20n, context)).toEqual([]);
  expect(wirelessProfileNamesOnSegment(clientInterface, 20n)).toEqual([]);
});
