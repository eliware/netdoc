import { expect, test } from "@jest/globals";
import { validateWirelessReferences } from "../../../src/validate/wireless/references.mjs";

test("combines wireless reference and duplicate broadcast diagnostics", () => {
  const record = {
    file: "ap.yaml",
    data: {
      interfaces: [
        {
          wireless: {
            role: "radio",
            broadcasts: [
              { wirelessNetworkId: 1n, segmentId: 2n },
              { wirelessNetworkId: 1n, segmentId: 2n },
            ],
          },
        },
        { wireless: { role: "client", profiles: [{ wirelessNetworkId: 3n, accessPointId: 4n }] } },
      ],
      wirelessManagement: { controllerId: 5n },
    },
  };
  const diagnostics = validateWirelessReferences(
    record,
    new Map([
      [1n, { kind: "wireless-network" }],
      [2n, { kind: "network-segment" }],
      [3n, { kind: "wireless-network" }],
      [4n, { kind: "network-device", record: { data: { roles: ["router"] } } }],
      [5n, { kind: "virtual-machine", record: { data: { roles: ["wireless-controller"] } } }],
    ]),
  );
  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/interfaces/1/wireless/profiles/0/accessPointId",
    "/interfaces/0/wireless/broadcasts/1",
  ]);
});

test("accepts records without wireless broadcasts", () => {
  expect(
    validateWirelessReferences(
      { file: "empty.yaml", data: { interfaces: [{}, { wireless: {} }] } },
      new Map(),
    ),
  ).toEqual([]);
});
