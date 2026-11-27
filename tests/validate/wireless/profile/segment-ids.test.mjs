import { expect, test } from "@jest/globals";
import wirelessProfileSegmentIds from "../../../../src/validate/wireless/profile/segment-ids.mjs";

test("finds segments advertised by access points in client profiles", () => {
  const networkInterface = {
    wireless: { role: "client", profiles: [{ wirelessNetworkId: 20n }] },
  };
  const entities = new Map([
    [
      30n,
      {
        record: {
          data: {
            interfaces: [
              {
                wireless: {
                  broadcasts: [
                    { wirelessNetworkId: 99n, segmentId: 8n },
                    { wirelessNetworkId: 20n, segmentId: 7n },
                  ],
                },
              },
            ],
          },
        },
      },
    ],
  ]);
  expect(wirelessProfileSegmentIds(networkInterface, entities)).toEqual([7n]);
});

test("returns no segments when a client has no matching profile", () => {
  expect(wirelessProfileSegmentIds({}, undefined)).toEqual([]);
});
