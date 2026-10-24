import { expect, test } from "@jest/globals";
import { prefixInNetwork } from "../../src/network/prefix-containment.mjs";

test("checks whether a prefix belongs to a network", () => {
  expect(prefixInNetwork("192.0.2.0/24", "192.0.2.0/24")).toBe(true);
  expect(prefixInNetwork("192.0.0.0/16", "192.0.2.0/24")).toBe(false);
  expect(prefixInNetwork("bad", "192.0.2.0/24")).toBe(false);
  expect(prefixInNetwork("192.0.2.0/24", "bad")).toBe(false);
});
