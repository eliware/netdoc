import { expect, test } from "@jest/globals";
import { parseAddress } from "../src/ip-addresses.mjs";

test("parses IPv4 and IPv6 addresses with prefixes", () => {
  expect(parseAddress("192.0.2.1/24")).toMatchObject({
    version: 4,
    integer: 3221225985n,
  });
  expect(parseAddress("2001:db8::1/64")).toMatchObject({
    version: 6,
    integer: 42540766411282592856903984951653826561n,
  });
  expect(parseAddress("::/0").version).toBe(6);
  expect(parseAddress("fe80::1%eth0/64")).toMatchObject({
    version: 6,
    integer: 338288524927261089654018896841347694593n,
  });
  expect(parseAddress("192.0.2.1/33")).toBeUndefined();
  expect(parseAddress("2001:db8::1/129")).toBeUndefined();
  expect(parseAddress("bad")).toBeUndefined();
  expect(parseAddress(4)).toBeUndefined();
});

test("rejects invalid address shapes and prefixes", () => {
  expect(parseAddress("192.0.2.1/24/extra")).toBeUndefined();
  expect(parseAddress("192.0.2.1/-1")).toBeUndefined();
});
