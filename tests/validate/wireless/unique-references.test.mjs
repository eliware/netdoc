import { expect, test } from "@jest/globals";
import { validateWirelessReferenceUniqueness } from "../../../src/validate/wireless/unique-references.mjs";

test("accepts distinct profiles and broadcasts", () => {
  expect(
    validateWirelessReferenceUniqueness({
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

test("coordinates repeated profile and broadcast diagnostics", () => {
  const diagnostics = validateWirelessReferenceUniqueness({
    file: "client.yaml",
    data: {
      id: 10n,
      interfaces: [
        {
          wireless: {
            profiles: [{ wirelessNetworkId: 1n }, { wirelessNetworkId: 1n }],
            broadcasts: [
              { wirelessNetworkId: 2n, segmentId: 3n },
              { wirelessNetworkId: 2n, segmentId: 3n },
            ],
          },
        },
      ],
    },
  });
  expect(diagnostics).toEqual([
    expect.objectContaining({ pointer: "/interfaces/0/wireless/profiles/1", objectId: 10n }),
    expect.objectContaining({ pointer: "/interfaces/0/wireless/broadcasts/1", objectId: 10n }),
  ]);
});

test("accepts records without wireless references", () => {
  expect(validateWirelessReferenceUniqueness({ file: "switch.yaml", data: {} })).toEqual([]);
});
