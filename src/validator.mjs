import { formatDiagnostic, createDiagnostic } from "./diagnostics.mjs";
import { loadInventory } from "./inventory-loader.mjs";
import { loadSchemaValidators } from "./schema-validators.mjs";
import { convertBigIntsForValidation } from "./yaml-files.mjs";
import { validateIdentifiers } from "./validate-identifiers.mjs";
import { validateReferences } from "./validate-references.mjs";
import { validateNetworks } from "./validate-networks.mjs";
import { validateNetworkValues } from "./network-value-checks.mjs";
import { validateSwitchPorts } from "./validate-switch-ports.mjs";

export function validateInventory(args, options = {}) {
  if (args.length !== 1) {
    (options.error ?? console.error)("Usage: netdoc validate <yaml-file-or-directory>");
    return 2;
  }
  return validateTarget(args[0], options);
}

export function validateTarget(
  target,
  { write = console.log, error = console.error, cwd = process.cwd(), schemaDirectory } = {},
) {
  let inventory;
  let validators;
  try {
    inventory = loadInventory(target, { cwd });
  } catch (cause) {
    error(cause.message);
    return 2;
  }
  try {
    validators = loadSchemaValidators(schemaDirectory);
  } catch (cause) {
    error(`Could not load schemas: ${cause.message}`);
    return 2;
  }
  const diagnostics = [...inventory.diagnostics];
  const schemaValidRecords = [];
  for (const record of inventory.records) {
    const validate = validators[record.data.kind];
    if (!validate) {
      diagnostics.push(
        createDiagnostic(
          record.file,
          "",
          record.data.id,
          "Missing or unsupported object kind.",
          "Use one of the supported schema kinds.",
        ),
      );
      continue;
    }
    if (validate(convertBigIntsForValidation(record.data))) {
      schemaValidRecords.push(record);
      continue;
    }
    for (const issue of validate.errors) {
      diagnostics.push(
        createDiagnostic(
          record.file,
          issue.instancePath,
          record.data.id,
          issue.message,
          `Correct the value at '${issue.instancePath || "/"}'.`,
        ),
      );
    }
  }
  const { diagnostics: idDiagnostics } = validateIdentifiers(inventory.records);
  diagnostics.push(...idDiagnostics);
  if (diagnostics.length === 0) {
    const { entitiesById: validEntities } = validateIdentifiers(schemaValidRecords);
    diagnostics.push(...validateReferences(schemaValidRecords, validEntities));
    diagnostics.push(...validateNetworks(schemaValidRecords, validEntities));
    diagnostics.push(...validateNetworkValues(schemaValidRecords));
    diagnostics.push(...validateSwitchPorts(schemaValidRecords, validEntities));
  }
  if (diagnostics.length > 0) {
    diagnostics.forEach((diagnostic) => error(formatDiagnostic(diagnostic)));
    error(`Found ${diagnostics.length} error(s) in ${inventory.fileCount} YAML file(s).`);
    return 1;
  }
  write(`Validated ${inventory.fileCount} YAML file(s).`);
  return 0;
}
