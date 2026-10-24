import { expect, test } from "@jest/globals";
import { formatDiagnostic } from "../../src/diagnostics/format.mjs";

test("formats complete diagnostics", () => {
  expect(
    formatDiagnostic({
      file: "record.yaml",
      pointer: "/interfaces/0",
      objectId: 123n,
      message: "Invalid link",
      suggestion: "Fix peer.",
    }),
  ).toBe("ERROR record.yaml#/interfaces/0 [id=123]: Invalid link. Suggestion: Fix peer.");
});

test("formats diagnostics without optional context", () => {
  expect(
    formatDiagnostic({
      file: "record.yaml",
      pointer: "",
      message: "Invalid record",
      suggestion: "",
    }),
  ).toBe("ERROR record.yaml: Invalid record.");
});
