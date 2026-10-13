import { expect, test } from "@jest/globals";
import { validNetworkAddressValue } from "../src/validate-network-address-value.mjs";

test("accepts addresses, prefixes, and allowed special values", () => {
  expect(validNetworkAddressValue("192.0.2.1", false, "/gateway")).toBe(true);
  expect(validNetworkAddressValue("192.0.2.0/24", true, "/network")).toBe(true);
  expect(validNetworkAddressValue("any", false, "/source", { allowAny: true })).toBe(true);
  expect(validNetworkAddressValue("masquerade", false, "/translation")).toBe(true);
});

test("rejects invalid values and special values in other fields", () => {
  expect(validNetworkAddressValue(123, false, "/gateway")).toBe(false);
  expect(validNetworkAddressValue("bad", false, "/gateway")).toBe(false);
  expect(validNetworkAddressValue("192.0.2.1", true, "/network")).toBe(false);
  expect(validNetworkAddressValue("any", false, "/gateway")).toBe(false);
  expect(validNetworkAddressValue("192.0.2.1/32", false, "/listener", { hostOnly: true })).toBe(
    false,
  );
  expect(validNetworkAddressValue("192.0.2.1", false, "/listener", { hostOnly: true })).toBe(true);
  expect(validNetworkAddressValue("masquerade", false, "/source")).toBe(false);
});
