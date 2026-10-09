import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { parseYamlFile } from "./yaml-files.mjs";

const schemaFiles = [
  "physical-machine.schema.yaml",
  "virtual-machine.schema.yaml",
  "network-device.schema.yaml",
  "network-segment.schema.yaml",
];
const schemaByKind = {
  "physical-machine": "physical-machine.schema.yaml",
  "virtual-machine": "virtual-machine.schema.yaml",
  "network-device": "network-device.schema.yaml",
  "network-segment": "network-segment.schema.yaml",
};

export function loadSchemaValidators(
  schemaDirectory = fileURLToPath(new URL("../docs/schema/", import.meta.url)),
) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addKeyword({ keyword: "version", schemaType: "string" });
  for (const name of ["common.schema.yaml", ...schemaFiles]) {
    const file = path.join(schemaDirectory, name);
    ajv.addSchema(parseYamlFile(file), pathToFileURL(file).href);
  }
  return Object.fromEntries(
    Object.entries(schemaByKind).map(([kind, name]) => {
      const file = path.join(schemaDirectory, name);
      return [kind, ajv.getSchema(pathToFileURL(file).href)];
    }),
  );
}
