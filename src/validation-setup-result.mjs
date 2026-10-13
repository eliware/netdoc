export function reportValidationSetupError(result, error) {
  if (result.error === undefined) return undefined;
  error(result.error);
  return 2;
}
