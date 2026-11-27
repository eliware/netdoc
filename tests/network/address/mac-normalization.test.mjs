import { expect, test } from "@jest/globals";
import normalizeMacAddress from "../../../src/network/address/mac-normalization.mjs";

test("normalizes MAC case and separators", () => {
  expect(normalizeMacAddress("AA-BB-CC-DD-EE-FF")).toBe("aa:bb:cc:dd:ee:ff");
  expect(normalizeMacAddress("aa:bb:cc:dd:ee:ff")).toBe("aa:bb:cc:dd:ee:ff");
});
