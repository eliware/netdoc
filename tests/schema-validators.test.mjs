import { expect, test } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchemaValidators } from "../src/schema-validators.mjs";

const root = fileURLToPath(new URL("../docs/schema/", import.meta.url));

test("loads a schema validator for each supported object kind", () => {
  const validators = loadSchemaValidators(root);
  expect(Object.keys(validators).sort()).toEqual([
    "network-device",
    "network-segment",
    "physical-machine",
    "virtual-machine",
  ]);
  expect(
    validators["network-device"]({
      version: "11.0",
      kind: "network-device",
      name: "router",
      roles: ["router"],
      implementation: "physical",
    }),
  ).toBe(true);
});

test("reports a missing schema file through a load error", () => {
  expect(() => loadSchemaValidators(path.join(root, "missing"))).toThrow();
});
