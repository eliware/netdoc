import { expect, test } from "@jest/globals";
import addressRange from "../../../src/network/address/ranges.mjs";

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
