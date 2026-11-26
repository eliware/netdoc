import loadSchemaValidators from "./validators.mjs";

export default function tryLoadSchemaValidators(schemaDirectory) {
  try {
    return { validators: loadSchemaValidators(schemaDirectory) };
  } catch (cause) {
    return { error: `Could not load schemas: ${cause.message}` };
  }
}
