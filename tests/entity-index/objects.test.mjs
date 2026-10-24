import { expect, test } from "@jest/globals";
import { indexObjectEntity } from "../../src/entity-index/objects.mjs";

test("indexes valid and invalid object IDs", () => {
  const entities = new Map();
  const valid = { file: "router.yaml", data: { kind: "network-device", id: 10n } };
  const invalid = { file: "invalid.yaml", data: { kind: "physical-machine", id: 12n } };
  indexObjectEntity(entities, valid, false);
  indexObjectEntity(entities, invalid, true);
  expect(entities.get(10n)).toMatchObject({
    kind: "network-device",
    pointer: "/id",
    record: valid,
  });
  expect(entities.get(12n)).toMatchObject({ invalid: true, kind: "physical-machine" });
});

test("skips object IDs that are not BIGINT values", () => {
  const entities = new Map();
  indexObjectEntity(entities, { file: "empty.yaml", data: {} }, false);
  expect(entities).toEqual(new Map());
});
