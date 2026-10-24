import { expect, test } from "@jest/globals";
import { validateWirelessAccessPointReferences } from "../../../../src/validate/wireless/access-points/references.mjs";

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
