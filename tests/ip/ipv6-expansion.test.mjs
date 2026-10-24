import { expect, test } from "@jest/globals";
import { expandIpv4EmbeddedIpv6 } from "../../src/ip/ipv6-expansion.mjs";

test("keeps IPv6 addresses without an embedded IPv4 suffix", () => {
  expect(expandIpv4EmbeddedIpv6("2001:db8::1")).toBe("2001:db8::1");
});

test("converts an embedded IPv4 suffix to two IPv6 groups", () => {
  expect(expandIpv4EmbeddedIpv6("::ffff:192.0.2.1")).toBe("::ffff:c000:0201");
  expect(expandIpv4EmbeddedIpv6("::ffff:192.0.0.255")).toBe("::ffff:c000:00ff");
});
