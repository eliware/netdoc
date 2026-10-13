import { expect, test } from "@jest/globals";
import { ipv4ToBigInt } from "../src/ipv4-to-bigint.mjs";

test("converts IPv4 octets to an integer", () => {
  expect(ipv4ToBigInt("192.0.2.1")).toBe(3221225985n);
});
