import { expect, test } from "@jest/globals";
import { validationJson } from "../../src/validation/json-report.mjs";

test("serializes successful validation as one JSON document", () => {
  expect(
    JSON.parse(validationJson({ exitCode: 0, fileCount: 2, diagnostics: [], records: [] })),
  ).toEqual({ status: "passed", summary: { files: 2, errors: 0 }, diagnostics: [] });
});

test("serializes diagnostics with stable codes and exact locations", () => {
  expect(
    JSON.parse(
      validationJson({
        exitCode: 1,
        fileCount: 1,
        diagnostics: [
          {
            code: "NETDOC_SCHEMA_VALIDATION",
            file: "bad.yaml",
            pointer: "/name",
            message: "Name is invalid.",
            suggestion: "Correct the value.",
          },
        ],
        records: [],
      }),
    ),
  ).toEqual({
    status: "failed",
    summary: { files: 1, errors: 1 },
    diagnostics: [
      {
        code: "NETDOC_SCHEMA_VALIDATION",
        file: "bad.yaml",
        pointer: "/name",
        message: "Name is invalid.",
        suggestion: "Correct the value.",
      },
    ],
  });
});

test("reports setup errors outside the diagnostic list", () => {
  expect(
    JSON.parse(
      validationJson({
        exitCode: 2,
        error: "Path does not exist.",
        fileCount: 0,
        diagnostics: [],
        records: [],
      }),
    ),
  ).toEqual({
    status: "error",
    summary: { files: 0, errors: 0 },
    diagnostics: [],
    error: { code: "NETDOC_SETUP_ERROR", message: "Path does not exist." },
  });
});

test("omits empty suggestions from JSON diagnostics", () => {
  expect(
    JSON.parse(
      validationJson({
        exitCode: 1,
        fileCount: 1,
        diagnostics: [
          {
            code: "NETDOC_VALIDATION_ERROR",
            file: "x.yaml",
            pointer: "",
            message: "Invalid",
            suggestion: "",
          },
        ],
      }),
    ).diagnostics[0],
  ).toEqual({
    code: "NETDOC_VALIDATION_ERROR",
    file: "x.yaml",
    pointer: "",
    message: "Invalid",
  });
});
