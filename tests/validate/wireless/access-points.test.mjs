import { expect, test } from "@jest/globals";
import {
  validateWirelessAccessPointReferences,
  validateWirelessAccessPointRoles,
} from "../../../src/validate/wireless/access-points.mjs";

test("validates optional access point references on wireless profiles", () => {
  const record = {
    file: "client.yaml",
    data: { interfaces: [{ wireless: { profiles: [{ accessPointId: 2n }] } }] },
  };
  expect(
    validateWirelessAccessPointReferences(record, new Map([[2n, { kind: "network-device" }]])),
  ).toEqual([]);
  expect(validateWirelessAccessPointReferences(record, new Map())).toHaveLength(1);
  expect(
    validateWirelessAccessPointReferences(
      { file: "client.yaml", data: { interfaces: [{ wireless: { profiles: [{}] } }] } },
      new Map(),
    ),
  ).toEqual([]);
  expect(
    validateWirelessAccessPointReferences({ file: "empty.yaml", data: {} }, new Map()),
  ).toEqual([]);
});

test("checks access point roles for profile references", () => {
  const record = {
    file: "client.yaml",
    data: { interfaces: [{ wireless: { profiles: [{ accessPointId: 2n }] } }] },
  };
  expect(
    validateWirelessAccessPointRoles(
      record,
      new Map([
        [2n, { kind: "network-device", record: { data: { roles: ["wireless-access-point"] } } }],
      ]),
    ),
  ).toEqual([]);
  expect(
    validateWirelessAccessPointRoles(
      record,
      new Map([[2n, { kind: "network-device", record: { data: { roles: ["router"] } } }]]),
    ).map(({ pointer }) => pointer),
  ).toEqual(["/interfaces/0/wireless/profiles/0/accessPointId"]);
  expect(
    validateWirelessAccessPointRoles(
      { file: "empty.yaml", data: { interfaces: [{ wireless: { profiles: [{}] } }] } },
      new Map(),
    ),
  ).toEqual([]);
});
