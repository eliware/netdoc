export function validateInventoryArguments(args, error = console.error) {
  if (args.length === 1) return undefined;
  error("Usage: netdoc validate <yaml-file-or-directory>");
  return 2;
}
