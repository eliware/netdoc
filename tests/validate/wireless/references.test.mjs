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
      ],
    },
  };
  const diagnostics = validateWirelessReferences(record, new Map());
  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/interfaces/0/wireless/broadcasts/0/wirelessNetworkId",
    "/interfaces/0/wireless/broadcasts/1/wirelessNetworkId",
    "/interfaces/0/wireless/broadcasts/0/segmentId",
    "/interfaces/0/wireless/broadcasts/1/segmentId",
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
