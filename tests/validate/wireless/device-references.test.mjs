import { expect, test } from "@jest/globals";
import { validateWirelessDeviceReferences } from "../../../src/validate/wireless/device-references.mjs";

test("reports missing wireless controller and access point targets", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { profiles: [{ wirelessNetworkId: 1n, accessPointId: 2n }] } }],
      wirelessManagement: { controllerId: 3n },
    },
  };
  expect(validateWirelessDeviceReferences(record, new Map())).toHaveLength(2);
});
