import { expect, test } from "@jest/globals";
import { validateInterfaceAddressSegment } from "../src/validate-interface-address-segment.mjs";

test("checks interface address containment in segment networks", () => {
  const record = { file: "node.yaml", data: { id: 1n } };
  expect(
    validateInterfaceAddressSegment("192.0.2.1/24", record, "/address", {
      ipNetworks: [{ cidr: "192.0.2.0/24" }],
    }),
  ).toEqual([]);
  expect(
    validateInterfaceAddressSegment("192.0.2.1/24", record, "/address", {
      ipNetworks: [{ cidr: "192.0.3.0/24" }],
    })[0].message,
  ).toContain("outside the networks");
  expect(validateInterfaceAddressSegment("192.0.2.1", record, "/address", undefined)).toEqual([]);
});
