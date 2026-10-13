import { expect, test } from "@jest/globals";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadSchemaRegistry } from "../src/schema-registry.mjs";

const root = fileURLToPath(new URL("../specs/schema/", import.meta.url));

test("loads shared schemas and object-kind schema registrations", () => {
  const { ajv, schemaByKind } = loadSchemaRegistry(root);
  expect(Object.keys(schemaByKind).sort()).toEqual([
    "network-device",
    "network-segment",
    "physical-machine",
    "virtual-machine",
  ]);
  for (const name of Object.values(schemaByKind)) {
    expect(ajv.getSchema(pathToFileURL(path.join(root, name)).href)).toEqual(expect.any(Function));
  }
});

test("reports a missing schema during registry loading", () => {
  expect(() => loadSchemaRegistry(path.join(root, "missing"))).toThrow();
});
