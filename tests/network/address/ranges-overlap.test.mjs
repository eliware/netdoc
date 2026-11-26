import { expect, test } from "@jest/globals";
import rangesOverlap from "../../../src/network/address/ranges-overlap.mjs";

test("detects overlapping ranges and allows separate host addresses", () => {
  expect(rangesOverlap({ start: 1n, end: 10n }, { start: 10n, end: 20n })).toBe(true);
  expect(rangesOverlap({ start: 1n, end: 1n }, { start: 2n, end: 2n })).toBe(false);
});
