import { expect, test } from "@jest/globals";
import { validateWirelessAccessPointRoles } from "../../../../src/validate/wireless/access-points/roles.mjs";

test("validates the required access point role on wireless profiles", () => {
  const record = {
    file: "client.yaml",
    data: { interfaces: [{ wireless: { profiles: [{ accessPointId: 2n }] } }] },
  };
  const target = (roles) =>
    new Map([[2n, { kind: "network-device", record: { data: { roles } } }]]);
  expect(validateWirelessAccessPointRoles(record, target(["wireless-access-point"]))).toEqual([]);
  expect(validateWirelessAccessPointRoles(record, target(["router"]))).toEqual([
    expect.objectContaining({
      pointer: "/interfaces/0/wireless/profiles/0/accessPointId",
      message: "Reference 2 does not have the 'wireless-access-point' role.",
    }),
  ]);
  expect(
    validateWirelessAccessPointRoles(
      { file: "empty.yaml", data: { interfaces: [{ wireless: { profiles: [{}] } }] } },
      new Map(),
    ),
  ).toEqual([]);
});
