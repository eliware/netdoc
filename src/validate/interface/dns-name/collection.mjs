import validateDnsNameDuplicates from "./duplicates.mjs";

export default function validateDnsNameDuplicatesAcrossRecords(records) {
  return records.flatMap((record) => validateDnsNameDuplicates(record));
}
