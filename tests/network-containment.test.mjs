import { expect, test } from "@jest/globals";
import { addressInNetwork, prefixInNetwork } from "../src/network-containment.mjs";

test("checks IPv4 and IPv6 address membership", () => {
  expect(addressInNetwork("192.0.2.8", "192.0.2.0/24")).toBe(true);
  expect(addressInNetwork("2001:db8::2", "2001:db8::/64")).toBe(true);
  expect(addressInNetwork("192.0.3.1", "192.0.2.0/24")).toBe(false);
  expect(addressInNetwork("192.0.2.1", "2001:db8::/64")).toBe(false);
  expect(addressInNetwork("bad", "192.0.2.0/24")).toBe(false);
  expect(addressInNetwork("192.0.2.1", "bad")).toBe(false);
});

test("checks whether a prefix belongs to a network", () => {
  expect(prefixInNetwork("192.0.2.0/24", "192.0.2.0/24")).toBe(true);
  expect(prefixInNetwork("192.0.0.0/16", "192.0.2.0/24")).toBe(false);
  expect(prefixInNetwork("bad", "192.0.2.0/24")).toBe(false);
  expect(prefixInNetwork("192.0.2.0/24", "bad")).toBe(false);
});
