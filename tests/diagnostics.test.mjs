import { expect, test } from "@jest/globals";
import { createDiagnostic } from "../src/diagnostics.mjs";

test("creates diagnostics with a derived code and optional explicit code", () => {
  expect(
    createDiagnostic("record.yaml", "/interfaces/0", 123n, "Reference missing", "Fix peer."),
  ).toEqual({
    code: "NETDOC_REFERENCE_INVALID",
    severity: "error",
    file: "record.yaml",
    pointer: "/interfaces/0",
    objectId: 123n,
    message: "Reference missing",
    suggestion: "Fix peer.",
  });
  expect(
    createDiagnostic("record.yaml", "", undefined, "Invalid record", "", "CUSTOM_CODE").code,
  ).toBe("CUSTOM_CODE");
});
