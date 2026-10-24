import { expect, test } from "@jest/globals";
import { addressRange, rangesOverlap } from "../../../../src/validate/interface/address/ranges.mjs";

test("calculates host and prefix address ranges", () => {
  expect(addressRange({ bits: 32, prefix: 32, integer: 3221225985n })).toEqual({
    start: 3221225985n,
    end: 3221225985n,
  });
  expect(addressRange({ bits: 32, prefix: 24, integer: 3221225984n })).toEqual({
    start: 3221225984n,
    end: 3221226239n,
  });
  expect(addressRange({ bits: 32, prefix: 24, integer: 3221225985n })).toEqual({
    start: 3221225985n,
    end: 3221225985n,
  });
});

test("detects overlapping ranges and allows separate host addresses", () => {
  expect(rangesOverlap({ start: 1n, end: 10n }, { start: 10n, end: 20n })).toBe(true);
  expect(rangesOverlap({ start: 1n, end: 1n }, { start: 2n, end: 2n })).toBe(false);
});
