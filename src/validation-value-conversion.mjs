export function convertBigIntsForValidation(value) {
  if (typeof value === "bigint") return Number(value);
  if (Array.isArray(value)) return value.map(convertBigIntsForValidation);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, convertBigIntsForValidation(item)]),
    );
  }
  return value;
}
