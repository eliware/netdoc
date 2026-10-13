import { expect, test } from "@jest/globals";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { schemaFiles } from "../src/schema-manifest.mjs";

test("lists every schema file in the schema folder", () => {
  const directory = fileURLToPath(new URL("../specs/schema/", import.meta.url));
  const files = readdirSync(directory).filter((name) => name.endsWith(".schema.yaml"));
  expect([...schemaFiles].sort()).toEqual(files.sort());
});
