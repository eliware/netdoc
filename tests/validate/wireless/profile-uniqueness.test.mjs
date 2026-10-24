import { expect, test } from "@jest/globals";
import { validateWirelessProfileUniqueness } from "../../../src/validate/wireless/profile-uniqueness.mjs";

test("allows distinct client profiles and reports repeated wireless network IDs", () => {
  const diagnostics = validateWirelessProfileUniqueness({
    file: "client.yaml",
    data: {
      id: 10n,
      interfaces: [
        {},
        {
          wireless: {
            profiles: [
              { wirelessNetworkId: 1n },
              { wirelessNetworkId: 2n },
              { wirelessNetworkId: 1n },
            ],
          },
        },
      ],
    },
  });
  expect(diagnostics).toEqual([
    expect.objectContaining({ pointer: "/interfaces/1/wireless/profiles/2", objectId: 10n }),
  ]);
});
