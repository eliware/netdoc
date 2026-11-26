import parseAnsibleInventoryArguments from "./ansible-inventory/arguments.mjs";
import buildAnsibleInventory from "./ansible-inventory/build.mjs";
import runInventoryValidation from "./validation/run.mjs";
import reportValidationErrors from "./validation/report-validation-errors.mjs";

export default function runAnsibleInventory(
  args,
  { write = console.log, error = console.error, validate = runInventoryValidation } = {},
) {
  const parsed = parseAnsibleInventoryArguments(args);
  if (parsed.error !== undefined) {
    error(parsed.error);
    return 2;
  }
  const result = validate(parsed.inventoryPath);
  if (result.error !== undefined) {
    error(result.error);
    return 2;
  }
  if (result.exitCode === 1) {
    reportValidationErrors(result.diagnostics, result.fileCount, error);
    return 1;
  }
  if (result.exitCode !== 0) {
    error("Inventory validation could not complete.");
    return 2;
  }
  let inventory;
  try {
    inventory = buildAnsibleInventory(result.records);
  } catch (cause) {
    error(cause.message);
    return 1;
  }
  const output =
    parsed.mode === "list" ? inventory : (inventory._meta.hostvars[parsed.hostname] ?? {});
  write(JSON.stringify(output));
  return 0;
}
