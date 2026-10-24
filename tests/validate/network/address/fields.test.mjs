import { expect, test } from "@jest/globals";
import { validateNetworkAddressFields } from "../../../../src/validate/network/address/fields.mjs";

test("skips valid and undefined address fields", () => {
  const record = { file: "router.yaml", data: { id: 7n } };
  expect(
    validateNetworkAddressFields(
      [
        ["/gateway", "192.0.2.1", false],
        ["/source", "any", false, { allowAny: true }],
        ["/optional", undefined, false],
      ],
      record,
    ),
  ).toEqual([]);
});
