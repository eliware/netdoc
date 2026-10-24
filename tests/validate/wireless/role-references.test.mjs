import { expect, test } from "@jest/globals";
import { validateWirelessRoleReferences } from "../../../src/validate/wireless/role-references.mjs";

test("accepts access point and controller references with their required roles", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { profiles: [{ accessPointId: 2n }] } }],
      wirelessManagement: { controllerId: 3n },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-device", record: { data: { roles: ["wireless-access-point"] } } }],
    [3n, { kind: "virtual-machine", record: { data: { roles: ["wireless-controller"] } } }],
  ]);
  expect(validateWirelessRoleReferences(record, entities)).toEqual([]);
});

test("reports access point and controller role mismatches", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { profiles: [{ accessPointId: 2n }] } }],
      wirelessManagement: { controllerId: 3n },
    },
  };
  const entities = new Map([
    [2n, { kind: "network-device", record: { data: { roles: ["router"] } } }],
    [3n, { kind: "virtual-machine", record: { data: { roles: ["host"] } } }],
  ]);
  expect(validateWirelessRoleReferences(record, entities)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ pointer: "/interfaces/0/wireless/profiles/0/accessPointId" }),
      expect.objectContaining({ pointer: "/wirelessManagement/controllerId" }),
    ]),
  );
});

test("requires roles when a referenced controller has no role list", () => {
  const record = {
    file: "client.yaml",
    data: { wirelessManagement: { controllerId: 3n } },
  };
  const entities = new Map([
    [3n, { kind: "virtual-machine", record: { data: { name: "controller" } } }],
  ]);
  expect(validateWirelessRoleReferences(record, entities)).toEqual([
    expect.objectContaining({
      pointer: "/wirelessManagement/controllerId",
      message: "Reference 3 does not have the 'wireless-controller' role.",
    }),
  ]);
});

test("skips profiles without access point pins and records without controllers", () => {
  expect(
    validateWirelessRoleReferences(
      { file: "client.yaml", data: { interfaces: [{ wireless: { profiles: [{}] } }] } },
      new Map(),
    ),
  ).toEqual([]);
});
