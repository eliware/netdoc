import { expect, test } from "@jest/globals";
import { validateWirelessNetworkReferences } from "../../../src/validate/wireless/network-references.mjs";

test("accepts wireless network IDs that resolve to wireless-network records", () => {
  const record = {
    file: "ap.yaml",
    data: {
      interfaces: [
        {
          wireless: {
            role: "radio",
            broadcasts: [{ wirelessNetworkId: 1n, segmentId: 2n }],
          },
        },
        { wireless: { role: "client", profiles: [{ wirelessNetworkId: 3n }] } },
      ],
    },
  };
  const entities = new Map([
    [1n, { kind: "wireless-network" }],
    [3n, { kind: "wireless-network" }],
  ]);
  expect(validateWirelessNetworkReferences(record, entities)).toEqual([]);
});

test("reports missing and wrong-kind wireless network references", () => {
  const record = {
    file: "client.yaml",
    data: { interfaces: [{ wireless: { profiles: [{ wirelessNetworkId: 4n }] } }] },
  };
  const diagnostics = validateWirelessNetworkReferences(
    record,
    new Map([[4n, { kind: "network-segment" }]]),
  );
  expect(diagnostics).toEqual([
    expect.objectContaining({ pointer: "/interfaces/0/wireless/profiles/0/wirelessNetworkId" }),
  ]);
  expect(validateWirelessNetworkReferences(record, new Map())).toHaveLength(1);
});
