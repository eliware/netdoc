import { expect, test } from "@jest/globals";
import isAllowedVirtualSharing from "../../../../src/validate/interface/address/virtual-sharing.mjs";

test("allows identical virtual ranges", () => {
  const previous = { assignment: "virtual", range: { start: 1n, end: 2n } };
  expect(isAllowedVirtualSharing(previous, { assignment: "virtual" }, { start: 1n, end: 2n })).toBe(
    true,
  );
});

test("rejects different assignments and ranges", () => {
  const previous = { assignment: "virtual", range: { start: 1n, end: 2n } };
  expect(isAllowedVirtualSharing(previous, { assignment: "static" }, { start: 1n, end: 2n })).toBe(
    false,
  );
  expect(isAllowedVirtualSharing(previous, { assignment: "virtual" }, { start: 2n, end: 3n })).toBe(
    false,
  );
});
