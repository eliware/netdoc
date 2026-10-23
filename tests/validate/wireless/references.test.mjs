import { expect, test } from "@jest/globals";
import { validateWirelessReferences } from "../../../src/validate/wireless/references.mjs";

test("checks broadcast segment references", () => {
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
      ],
    },
  };
  const valid = new Map([
    [1n, { kind: "wireless-network" }],
    [2n, { kind: "network-segment" }],
  ]);
  expect(validateWirelessReferences(record, valid)).toEqual([]);
  expect(validateWirelessReferences(record, new Map())).toHaveLength(2);
});

test("does not duplicate errors for invalid broadcast segments", () => {
  const record = {
    file: "ap.yaml",
    data: {
      interfaces: [{ wireless: { broadcasts: [{ wirelessNetworkId: 1n, segmentId: 2n }] } }],
    },
  };
  const entities = new Map([
    [1n, { kind: "wireless-network", invalid: true }],
    [2n, { kind: "network-segment", invalid: true }],
  ]);
  expect(validateWirelessReferences(record, entities)).toEqual([]);
});
