import { expect, jest, test } from "@jest/globals";
import { validateRecords } from "../../src/validate/records.mjs";

test("collects valid records and reports unsupported kinds", () => {
  const valid = jest.fn(() => true);
  const result = validateRecords(
    [
      { file: "good.yaml", data: { kind: "known", id: 1n, nested: { value: 2n } } },
      { file: "bad.yaml", data: { kind: "unknown", id: 3n } },
    ],
    { known: valid },
  );
  expect(result.validRecords).toHaveLength(1);
  expect(valid).toHaveBeenCalledWith({ kind: "known", id: 1, nested: { value: 2 } });
  expect(result.diagnostics.map(({ message }) => message)).toEqual([
    "Missing or unsupported object type.",
  ]);
});

test("converts schema issues into record diagnostics", () => {
  const invalid = jest.fn(() => false);
  invalid.errors = [
    { instancePath: "/roles/0", message: "must be a valid role" },
    { instancePath: "", message: "must be an object" },
  ];
  const result = validateRecords([{ file: "invalid.yaml", data: { kind: "known", id: 4n } }], {
    known: invalid,
  });
  expect(result.validRecords).toEqual([]);
  expect(result.diagnostics.map(({ pointer, suggestion }) => [pointer, suggestion])).toEqual([
    ["/roles/0", "Correct the value at '/roles/0'."],
    ["", "Correct the value at '/'."],
  ]);
});
