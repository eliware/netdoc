import { expect, test } from "@jest/globals";
import { validateWirelessRoles } from "../../../src/validate/wireless/roles.mjs";

const record = { file: "client.yaml", data: { id: 1n } };
const check = [
  2n,
  "/interfaces/0/wireless/profiles/0/accessPointId",
  ["network-device"],
  "wireless-access-point",
];

test("accepts a reference whose target has the required role", () => {
  const entities = new Map([
    [2n, { kind: "network-device", record: { data: { roles: ["wireless-access-point"] } } }],
  ]);
  expect(validateWirelessRoles([check], record, entities)).toEqual([]);
});

test("reports valid-kind targets without the required role", () => {
  const entities = new Map([
    [2n, { kind: "network-device", record: { data: { roles: ["router"] } } }],
  ]);
  expect(validateWirelessRoles([check], record, entities)).toEqual([
    expect.objectContaining({
      pointer: check[1],
      objectId: 1n,
      message: "Reference 2 does not have the 'wireless-access-point' role.",
    }),
  ]);
});

test("skips missing, invalid, and wrong-kind targets", () => {
  const entities = new Map([
    [3n, { kind: "network-device", invalid: true, record: { data: { roles: [] } } }],
    [4n, { kind: "physical-machine", record: { data: { roles: [] } } }],
  ]);
  const checks = [
    check,
    [3n, "/bad", ["network-device"], "wireless-access-point"],
    [4n, "/wrong", ["network-device"], "wireless-access-point"],
  ];
  expect(validateWirelessRoles(checks, record, entities)).toEqual([]);
});
