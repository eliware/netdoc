import { expect, test } from "@jest/globals";
import {
  validateWirelessControllerReferences,
  validateWirelessControllerRoles,
} from "../../../src/validate/wireless/controllers.mjs";

test("validates optional wireless controller references", () => {
  const record = { file: "ap.yaml", data: { wirelessManagement: { controllerId: 3n } } };
  expect(
    validateWirelessControllerReferences(record, new Map([[3n, { kind: "virtual-machine" }]])),
  ).toEqual([]);
  expect(validateWirelessControllerReferences(record, new Map())).toHaveLength(1);
  expect(validateWirelessControllerReferences({ file: "empty.yaml", data: {} }, new Map())).toEqual(
    [],
  );
});

test("checks controller roles and reports targets without a role list", () => {
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
    ).map(({ pointer }) => pointer),
  ).toEqual(["/wirelessManagement/controllerId"]);
  expect(
    validateWirelessControllerRoles(
      record,
      new Map([[3n, { kind: "virtual-machine", record: { data: { name: "controller" } } }]]),
    ).map(({ pointer }) => pointer),
  ).toEqual(["/wirelessManagement/controllerId"]);
  expect(validateWirelessControllerRoles({ file: "empty.yaml", data: {} }, new Map())).toEqual([]);
});
