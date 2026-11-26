import { expect, test } from "@jest/globals";
import validateWirelessUniqueness from "../../../src/validate/wireless/uniqueness.mjs";

test("accepts distinct profiles and broadcasts", () => {
  expect(
    validateWirelessUniqueness({
      file: "client.yaml",
      data: {
        interfaces: [
          {
            wireless: {
              profiles: [{ wirelessNetworkId: 1n }, { wirelessNetworkId: 2n }],
              broadcasts: [
                { wirelessNetworkId: 1n, segmentId: 3n },
                { wirelessNetworkId: 1n, segmentId: 4n },
              ],
            },
          },
        ],
      },
    }),
  ).toEqual([]);
});

test("accepts records without wireless references", () => {
  expect(validateWirelessUniqueness({ file: "switch.yaml", data: {} })).toEqual([]);
});
