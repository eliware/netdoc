import { expect, test } from "@jest/globals";
import { validateWirelessControllerReferences } from "../../../src/validate/wireless/controllers.mjs";

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
