import { validateInventoryArguments } from "../validate/arguments.mjs";
import { validateTarget } from "../validator.mjs";

export function validateInventory(args, options = {}) {
  const argumentResult = validateInventoryArguments(args, options.error);
  if (argumentResult !== undefined) return argumentResult;
  return validateTarget(args[0], options);
}
