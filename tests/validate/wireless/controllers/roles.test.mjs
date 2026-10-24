import { expect, test } from "@jest/globals";
import { validateWirelessControllerRoles } from "../../../../src/validate/wireless/controllers/roles.mjs";

test("validates wireless controller roles", () => {
  const record = { file: "ap.yaml", data: { wirelessManagement: { controllerId: 3n } } };
  expect(
    validateWirelessControllerRoles(
      record,
      new Map([
        [3n, { kind: "virtual-machine", record: { data: { roles: ["wireless-controller"] } } }],
      ]),
    ),
  ).toEqual([]);
  expect(
    validateWirelessControllerRoles(
      record,
      new Map([[3n, { kind: "virtual-machine", record: { data: { roles: ["host"] } } }]]),
    ),
  ).toEqual([
    expect.objectContaining({
      pointer: "/wirelessManagement/controllerId",
      message: "Reference 3 does not have the 'wireless-controller' role.",
    }),
  ]);
  expect(
    validateWirelessControllerRoles(
      record,
      new Map([[3n, { kind: "virtual-machine", record: { data: { name: "controller" } } }]]),
    ),
  ).toHaveLength(1);
  expect(validateWirelessControllerRoles({ file: "empty.yaml", data: {} }, new Map())).toEqual([]);
});
