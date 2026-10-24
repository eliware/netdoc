const identifierKeys = new Set([
  "id",
  "residentOn",
  "segmentId",
  "segmentIds",
  "pvidSegmentId",
  "connectsTo",
  "nodeId",
  "deviceId",
  "peerId",
]);

export function convertBigIntsForValidation(value, key, identifiers = new Map()) {
  // Validate IDs and references from the initial BigInt records before this schema-only conversion.
  if (typeof value === "bigint") {
    if (!identifierKeys.has(key)) {
      const number = Number(value);
      return Number.isSafeInteger(number) ? number : value.toString();
    }
    if (!identifiers.has(value)) identifiers.set(value, identifiers.size + 1);
    return identifiers.get(value);
  }
  if (Array.isArray(value))
    return value.map((item) => convertBigIntsForValidation(item, key, identifiers));
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([property, item]) => [
        property,
        convertBigIntsForValidation(item, property, identifiers),
      ]),
    );
  }
  return value;
}
