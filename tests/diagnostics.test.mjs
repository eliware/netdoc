import { expect, test } from "@jest/globals";
import { createDiagnostic, formatDiagnostic } from "../src/diagnostics.mjs";

test("formats complete diagnostics", () => {
  const value = createDiagnostic("record.yaml", "/interfaces/0", 123n, "Invalid link", "Fix peer.");
  expect(value.severity).toBe("error");
  expect(formatDiagnostic(value)).toBe(
    "ERROR record.yaml#/interfaces/0 [id=123]: Invalid link. Suggestion: Fix peer.",
  );
});

test("formats diagnostics without optional context", () => {
  const value = createDiagnostic("record.yaml", "", undefined, "Invalid record", "");
  expect(formatDiagnostic(value)).toBe("ERROR record.yaml: Invalid record.");
});
