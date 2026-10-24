import { expect, test } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tryLoadSchemaValidators } from "../../src/schema/load-result.mjs";

const root = fileURLToPath(new URL("../../specs/schema/", import.meta.url));

test("returns schema load errors for the validation workflow", () => {
  expect(tryLoadSchemaValidators(path.join(root, "missing"))).toEqual({
    error: expect.stringContaining("Could not load schemas:"),
  });
});
