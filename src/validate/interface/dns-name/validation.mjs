import { validateDnsNameDuplicates } from "./duplicates.mjs";

export function validateDnsNameDuplicatesAcrossRecords(records) {
  return records.flatMap((record) => validateDnsNameDuplicates(record));
}
