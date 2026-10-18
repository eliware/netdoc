import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { parseYamlFile } from "../yaml/parser.mjs";
import { schemaByKind } from "./kind-map.mjs";
import { schemaFiles } from "./manifest.mjs";
import { createSchemaValidator } from "../create-schema-validator.mjs";

export function loadSchemaRegistry(
  schemaDirectory = fileURLToPath(new URL("../../specs/schema/", import.meta.url)),
) {
  const ajv = createSchemaValidator();
  for (const name of schemaFiles) {
    const file = path.join(schemaDirectory, name);
    ajv.addSchema(parseYamlFile(file), pathToFileURL(file).href);
  }
  return { ajv, schemaByKind, schemaDirectory };
}
