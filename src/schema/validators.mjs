import { pathToFileURL } from "node:url";
import path from "node:path";
import { loadSchemaRegistry } from "./registry.mjs";

export function loadSchemaValidators(schemaDirectory) {
  const registry = loadSchemaRegistry(schemaDirectory);
  const { ajv, schemaByKind } = registry;
  return Object.fromEntries(
    Object.entries(schemaByKind).map(([kind, name]) => {
      const file = path.join(registry.schemaDirectory, name);
      return [kind, ajv.getSchema(pathToFileURL(file).href)];
    }),
  );
}

export function tryLoadSchemaValidators(schemaDirectory) {
  try {
    return { validators: loadSchemaValidators(schemaDirectory) };
  } catch (cause) {
    return { error: `Could not load schemas: ${cause.message}` };
  }
}
