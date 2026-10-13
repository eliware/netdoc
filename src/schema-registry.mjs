import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { parseYamlFile } from "./yaml-parser.mjs";
import { schemaByKind } from "./schema-kind-map.mjs";
import { schemaFiles } from "./schema-manifest.mjs";

export function loadSchemaRegistry(
  schemaDirectory = fileURLToPath(new URL("../specs/schema/", import.meta.url)),
) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addKeyword({ keyword: "version", schemaType: "string" });
  for (const name of schemaFiles) {
    const file = path.join(schemaDirectory, name);
    ajv.addSchema(parseYamlFile(file), pathToFileURL(file).href);
  }
  return { ajv, schemaByKind, schemaDirectory };
}
