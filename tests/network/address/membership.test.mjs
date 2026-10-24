import { expect, test } from "@jest/globals";
import { addressInNetwork } from "../../../src/network/address/membership.mjs";

test("checks IPv4 and IPv6 address membership", () => {
  expect(addressInNetwork("192.0.2.8", "192.0.2.0/24")).toBe(true);
  expect(addressInNetwork("2001:db8::2", "2001:db8::/64")).toBe(true);
  expect(addressInNetwork("192.0.3.1", "192.0.2.0/24")).toBe(false);
  expect(addressInNetwork("192.0.2.1", "2001:db8::/64")).toBe(false);
  expect(addressInNetwork("bad", "192.0.2.0/24")).toBe(false);
  expect(addressInNetwork("192.0.2.1", "bad")).toBe(false);
});
