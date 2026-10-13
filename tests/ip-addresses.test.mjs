import { expect, test } from "@jest/globals";
import { parseAddress } from "../src/ip-addresses.mjs";

test("parses IPv4 and IPv6 addresses with prefixes", () => {
  expect(parseAddress("192.0.2.1/24").version).toBe(4);
  expect(parseAddress("2001:db8::1/64").version).toBe(6);
  expect(parseAddress("::/0").version).toBe(6);
  expect(parseAddress("192.0.2.1/33")).toBeUndefined();
  expect(parseAddress("bad")).toBeUndefined();
  expect(parseAddress(4)).toBeUndefined();
});

test("rejects invalid address shapes and prefixes", () => {
  expect(parseAddress("192.0.2.1/24/extra")).toBeUndefined();
  expect(parseAddress("192.0.2.1/-1")).toBeUndefined();
});
