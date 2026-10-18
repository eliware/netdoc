import { expect, test } from "@jest/globals";
import { validateNetworkAddressFields } from "../../../../src/validate/network/address/fields.mjs";

test("validates address fields and reports the source location", () => {
  const record = { file: "router.yaml", data: { id: 7n } };
  expect(
    validateNetworkAddressFields(
      [
        ["/gateway", "192.0.2.1", false],
        ["/network", "bad", true],
        ["/source", "any", false, { allowAny: true }],
        ["/gateway", "any", false],
        ["/optional", undefined, false],
      ],
      record,
    ),
  ).toMatchObject([
    {
      file: "router.yaml",
      pointer: "/network",
      objectId: 7n,
      message: "Invalid IP address or network 'bad'.",
    },
    {
      file: "router.yaml",
      pointer: "/gateway",
      objectId: 7n,
      message: "Invalid IP address or network 'any'.",
    },
  ]);
});
