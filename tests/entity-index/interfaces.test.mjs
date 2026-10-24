import { expect, test } from "@jest/globals";
import { indexInterfaceEntities } from "../../src/entity-index/interfaces.mjs";

test("indexes valid and invalid interface IDs", () => {
  const entities = new Map();
  const record = {
    file: "router.yaml",
    data: { interfaces: [null, { id: 11n, name: "port" }, { id: "12", name: "bad" }] },
  };
  indexInterfaceEntities(entities, record, true);
  expect(entities.get(11n)).toMatchObject({
    invalid: true,
    kind: "interface",
    pointer: "/interfaces/1/id",
    record,
    networkInterface: record.data.interfaces[1],
  });
  expect(entities.size).toBe(1);
});

test("skips interface lists that are not arrays", () => {
  const entities = new Map();
  indexInterfaceEntities(entities, { file: "empty.yaml", data: { interfaces: {} } }, false);
  expect(entities).toEqual(new Map());
});
