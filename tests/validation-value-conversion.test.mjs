import { expect, test } from "@jest/globals";
import { convertBigIntsForValidation } from "../src/validation-value-conversion.mjs";

test("converts nested BigInts and preserves other values", () => {
  const date = new Date("2026-01-01T00:00:00Z");
  expect(convertBigIntsForValidation({ id: 5n, values: [7n, null], date })).toEqual({
    id: 5,
    values: [7, null],
    date,
  });
  expect(convertBigIntsForValidation("value")).toBe("value");
});
