import { expect, test } from "@jest/globals";
import { validateWirelessDeviceReferences } from "../../../src/validate/wireless/device-references.mjs";

test("checks the controller when a profile access point resolves", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { profiles: [{ wirelessNetworkId: 1n, accessPointId: 2n }] } }],
      wirelessManagement: { controllerId: 3n },
    },
  };
  const diagnostics = validateWirelessDeviceReferences(
    record,
    new Map([[2n, { kind: "network-device" }]]),
  );
  expect(diagnostics.map(({ pointer }) => pointer)).toEqual(["/wirelessManagement/controllerId"]);
});
