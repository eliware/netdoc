import { formatDiagnostic } from "./diagnostics.mjs";
import { loadInventory } from "./inventory-loader.mjs";
import { loadSchemaValidators } from "./schema-validators.mjs";
import { validateIdentifiers } from "./validate-identifiers.mjs";
import { validateReferences } from "./validate-references.mjs";
import { validateNetworks } from "./validate-networks.mjs";
import { validateNetworkValues } from "./network-value-validation.mjs";
import { validateSwitchPorts } from "./validate-switch-ports.mjs";
import { validateRecords } from "./validate-records.mjs";

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
  const { validRecords, diagnostics: schemaDiagnostics } = validateRecords(
    inventory.records,
    validators,
  );
  const diagnostics = [...inventory.diagnostics, ...schemaDiagnostics];
  const { diagnostics: idDiagnostics } = validateIdentifiers(inventory.records);
  diagnostics.push(...idDiagnostics);
  if (diagnostics.length === 0) {
    const { entitiesById: validEntities } = validateIdentifiers(validRecords);
    diagnostics.push(...validateReferences(validRecords, validEntities));
    diagnostics.push(...validateNetworks(validRecords, validEntities));
    diagnostics.push(...validateNetworkValues(validRecords));
    diagnostics.push(...validateSwitchPorts(validRecords, validEntities));
  }
  if (diagnostics.length > 0) {
    diagnostics.forEach((diagnostic) => error(formatDiagnostic(diagnostic)));
    error(`Found ${diagnostics.length} error(s) in ${inventory.fileCount} YAML file(s).`);
    return 1;
  }
  write(`Validated ${inventory.fileCount} YAML file(s).`);
  return 0;
}
