import { expect, test } from "@jest/globals";
import { ipv6ToBigInt } from "../src/ipv6-to-bigint.mjs";

test("converts compressed and expanded IPv6 addresses to integers", () => {
  expect(ipv6ToBigInt("2001:db8::1")).toBe(42540766411282592856903984951653826561n);
  expect(ipv6ToBigInt("::")).toBe(0n);
});

test("converts IPv4-mapped IPv6 addresses after suffix expansion", () => {
  expect(ipv6ToBigInt("::ffff:192.0.2.1")).toBe(281473902969345n);
});

test("converts IPv4-compatible and mixed IPv6 forms with dotted suffixes", () => {
  expect(ipv6ToBigInt("::192.0.2.1")).toBe(3221225985n);
  expect(ipv6ToBigInt("2001:db8::192.0.2.1")).toBe(0x20010db80000000000000000c0000201n);
  expect(ipv6ToBigInt("2001:db8::192.0.2.1")).toBe(ipv6ToBigInt("2001:db8::c000:0201"));
});
