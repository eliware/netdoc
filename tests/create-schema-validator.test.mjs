import { expect, test } from "@jest/globals";
import { createSchemaValidator } from "../src/create-schema-validator.mjs";

test("configures draft 2020 validation with formats and schema version metadata", () => {
  const ajv = createSchemaValidator();
  ajv.addSchema({
    $id: "https://example.test/schema",
    version: "11.0",
    type: "object",
    properties: { date: { type: "string", format: "date" } },
  });
  const validate = ajv.getSchema("https://example.test/schema");
  expect(validate({ date: "2026-10-13" })).toBe(true);
  expect(validate({ date: "not-a-date" })).toBe(false);
});
