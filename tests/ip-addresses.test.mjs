import { expect, test } from "@jest/globals";
import {
  addressInNetwork,
  parseAddress,
  prefixInNetwork,
  sameAddress,
} from "../src/ip-addresses.mjs";

test("parses IPv4 and IPv6 addresses with prefixes", () => {
  expect(parseAddress("192.0.2.1/24").version).toBe(4);
  expect(parseAddress("2001:db8::1/64").version).toBe(6);
  expect(parseAddress("::/0").version).toBe(6);
  expect(parseAddress("192.0.2.1/33")).toBeUndefined();
  expect(parseAddress("bad")).toBeUndefined();
  expect(parseAddress(4)).toBeUndefined();
});

test("checks address membership and equality", () => {
  expect(addressInNetwork("192.0.2.8", "192.0.2.0/24")).toBe(true);
  expect(addressInNetwork("2001:db8::2", "2001:db8::/64")).toBe(true);
  expect(addressInNetwork("192.0.3.1", "192.0.2.0/24")).toBe(false);
  expect(prefixInNetwork("192.0.2.0/24", "192.0.2.0/24")).toBe(true);
  expect(prefixInNetwork("192.0.0.0/16", "192.0.2.0/24")).toBe(false);
  expect(addressInNetwork("192.0.2.1", "2001:db8::/64")).toBe(false);
  expect(sameAddress("2001:db8::1", "2001:0db8:0:0:0:0:0:1")).toBe(true);
  expect(sameAddress("invalid", "192.0.2.1")).toBe(false);
});
