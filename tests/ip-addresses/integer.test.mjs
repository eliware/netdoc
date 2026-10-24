import { expect, test } from "@jest/globals";
import { addressToBigInt } from "../../src/ip-addresses/integer.mjs";

test("converts parsed IPv4 and IPv6 addresses to integers", () => {
  expect(addressToBigInt("192.0.2.1", 4)).toBe(3221225985n);
  expect(addressToBigInt("2001:db8::1", 6)).toBe(42540766411282592856903984951653826561n);
});
