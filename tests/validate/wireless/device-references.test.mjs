import { expect, test } from "@jest/globals";
import { validateWirelessDeviceReferences } from "../../../src/validate/wireless/device-references.mjs";

test("validates pinned access points and wireless controller references by role", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { profiles: [{ wirelessNetworkId: 1n, accessPointId: 2n }] } }],
      wirelessManagement: { controllerId: 3n },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-device", record: { data: { roles: ["wireless-access-point"] } } }],
    [3n, { kind: "virtual-machine", record: { data: { roles: ["wireless-controller"] } } }],
  ]);
  expect(validateWirelessDeviceReferences(record, entities)).toEqual([]);
});

test("reports targets without required roles and skips invalid or wrong-kind targets", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { profiles: [{ wirelessNetworkId: 1n, accessPointId: 2n }] } }],
      wirelessManagement: { controllerId: 4n },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-device", record: { data: { roles: ["router"] } } }],
    [4n, { kind: "physical-machine", record: { data: { roles: ["wireless-controller"] } } }],
    [5n, { kind: "network-device", invalid: true, record: { data: { roles: [] } } }],
  ]);
  const diagnostics = validateWirelessDeviceReferences(record, entities);
  expect(diagnostics).toHaveLength(2);
  expect(diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ pointer: "/interfaces/0/wireless/profiles/0/accessPointId" }),
      expect.objectContaining({ pointer: "/wirelessManagement/controllerId" }),
    ]),
  );
  expect(
    validateWirelessDeviceReferences(
      {
        file: "client.yaml",
        data: {
          interfaces: [{ wireless: { profiles: [{ wirelessNetworkId: 1n, accessPointId: 5n }] } }],
        },
      },
      new Map([[5n, entities.get(5n)]]),
    ),
  ).toEqual([]);
});

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
