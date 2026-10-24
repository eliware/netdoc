import { expect, test } from "@jest/globals";
import { validateWirelessDeviceReferences } from "../../../src/validate/wireless/device-references.mjs";

test("coordinates access-point and controller references", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { profiles: [{ wirelessNetworkId: 1n, accessPointId: 2n }] } }],
      wirelessManagement: { controllerId: 3n },
    },
  };
  const accessPoint = {
    kind: "network-device",
    record: { data: { roles: ["wireless-access-point"] } },
  };
  const controller = {
    kind: "virtual-machine",
    record: { data: { roles: ["wireless-controller"] } },
  };
  expect(
    validateWirelessDeviceReferences(
      record,
      new Map([
        [2n, accessPoint],
        [3n, controller],
      ]),
    ),
  ).toEqual([]);
  expect(validateWirelessDeviceReferences(record, new Map())).toEqual([
    expect.objectContaining({ pointer: "/interfaces/0/wireless/profiles/0/accessPointId" }),
    expect.objectContaining({ pointer: "/wirelessManagement/controllerId" }),
  ]);
});
