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

export function convertBigIntsForValidation(value, key) {
  // Validate IDs and references from the original BigInt records before this schema-only conversion.
  if (typeof value === "bigint") return identifierKeys.has(key) ? 1 : Number(value);
  if (Array.isArray(value)) return value.map((item) => convertBigIntsForValidation(item, key));
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([property, item]) => [
        property,
        convertBigIntsForValidation(item, property),
      ]),
    );
  }
  return value;
}
