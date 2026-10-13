import { expect, test } from "@jest/globals";
import { selectRelationshipValidationRecords } from "../src/select-relationship-validation-records.mjs";

test("keeps records without identifier errors", () => {
  const records = [
    { file: "machine.yaml", data: { id: 1n } },
    { file: "router.yaml", data: { id: 2n, interfaces: [{ id: 3n }] } },
  ];
  expect(selectRelationshipValidationRecords(records, [])).toEqual(records);
});

test("excludes every record with an invalid or conflicting object or interface ID", () => {
  const conflictedId = 10n;
  const records = [
    { file: "first.yaml", data: { id: conflictedId } },
    { file: "second.yaml", data: { id: 20n, interfaces: [{ id: conflictedId }] } },
    { file: "valid.yaml", data: { id: 30n } },
    { file: "optional.yaml", data: { interfaces: [] } },
  ];
  const diagnostics = [{ objectId: conflictedId }, { objectId: "not-an-ID" }];
  expect(selectRelationshipValidationRecords(records, diagnostics)).toEqual([
    records[2],
    records[3],
  ]);
});
