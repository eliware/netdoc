import { expect, test } from "@jest/globals";
import { sameAddress } from "../src/address-equality.mjs";

test("compares canonical IPv4 and IPv6 addresses", () => {
  expect(sameAddress("2001:db8::1", "2001:0db8:0:0:0:0:0:1")).toBe(true);
  expect(sameAddress("192.0.2.1", "192.0.2.2")).toBe(false);
  expect(sameAddress("192.0.2.1", "2001:db8::1")).toBe(false);
  expect(sameAddress("invalid", "192.0.2.1")).toBe(false);
  expect(sameAddress("192.0.2.1", "invalid")).toBe(false);
});
