import { expect, test } from "@jest/globals";
import { validateWirelessControllerReferences } from "../../../../src/validate/wireless/controllers/references.mjs";

test("validates controller references on records with wireless client profiles", () => {
  const record = {
    file: "client.yaml",
    data: {
      interfaces: [{ wireless: { role: "client", profiles: [{ wirelessNetworkId: 1n }] } }],
      wirelessManagement: { controllerId: 3n },
    },
  };
  expect(
    validateWirelessControllerReferences(record, new Map([[3n, { kind: "virtual-machine" }]])),
  ).toEqual([]);
  expect(validateWirelessControllerReferences(record, new Map())).toHaveLength(1);
  expect(validateWirelessControllerReferences({ file: "empty.yaml", data: {} }, new Map())).toEqual(
    [],
  );
});
