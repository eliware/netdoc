import { expect, test } from "@jest/globals";
import validateWirelessReferences from "../../../src/validate/wireless/references.mjs";

test("combines wireless reference and uniqueness diagnostics", () => {
  const record = {
    file: "client.yaml",
    data: {
      id: 10n,
      interfaces: [
        {
          wireless: {
            role: "client",
            profiles: [{ wirelessNetworkId: 1n }, { wirelessNetworkId: 1n }],
          },
        },
      ],
      wirelessManagement: { controllerId: 2n },
    },
  };
  const diagnostics = validateWirelessReferences(
    record,
    new Map([[1n, { kind: "wireless-network" }]]),
  );
  expect(diagnostics.map(({ pointer }) => pointer)).toEqual([
    "/wirelessManagement/controllerId",
    "/interfaces/0/wireless/profiles/1",
  ]);
});
