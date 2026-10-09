import fs from "node:fs";
import path from "node:path";
import { convertBigIntsForValidation, collectYamlFiles, parseYamlFile } from "./yaml-files.mjs";
import { loadSchemaValidators } from "./schema-validators.mjs";

export function validateInventory(
  args,
  { cwd = process.cwd(), write = console.log, error = console.error, schemaDirectory } = {},
) {
  if (args.length !== 1) {
    error("Usage: netdoc validate <yaml-file-or-directory>");
    return 2;
  }
  return validateTarget(args[0], { cwd, write, error, schemaDirectory });
}

export function validateTarget(
  target,
  { cwd = process.cwd(), write = console.log, error = console.error, schemaDirectory } = {},
) {
  if (typeof target !== "string" || target.length === 0) {
    error(`Path does not exist: ${target}`);
    return 2;
  }
  const absoluteTarget = path.resolve(cwd, target);
  if (!fs.existsSync(absoluteTarget)) {
    error(`Path does not exist: ${absoluteTarget}`);
    return 2;
  }
  let validators;
  try {
    validators = loadSchemaValidators(schemaDirectory);
  } catch (cause) {
    error(`Could not load schemas: ${cause.message}`);
    return 2;
  }
  const files = collectYamlFiles(absoluteTarget).sort();
  if (files.length === 0) {
    error(`No YAML files found: ${absoluteTarget}`);
    return 2;
  }
  let errorCount = 0;
  for (const file of files) {
    const relativeFile = path.relative(cwd, file);
    let data;
    try {
      data = parseYamlFile(file, true);
    } catch (cause) {
      error(`${relativeFile}: YAML parse error: ${cause.message}`);
      errorCount += 1;
      continue;
    }
    const validate = data && typeof data === "object" ? validators[data.kind] : undefined;
    if (!validate) {
      error(`${relativeFile}: missing or unsupported object kind`);
      errorCount += 1;
      continue;
    }
    if (!validate(convertBigIntsForValidation(data))) {
      for (const issue of validate.errors) {
        error(`${relativeFile}${issue.instancePath || "/"}: ${issue.message}`);
        errorCount += 1;
      }
    }
  }
  if (errorCount > 0) {
    error(`Found ${errorCount} error(s) in ${files.length} YAML file(s).`);
    return 1;
  }
  write(`Validated ${files.length} YAML file(s).`);
  return 0;
}
