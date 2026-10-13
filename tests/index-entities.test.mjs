import { expect, test } from "@jest/globals";
import { indexEntities } from "../src/index-entities.mjs";

test("indexes object and interface IDs with their source records", () => {
  const record = {
    file: "router.yaml",
    data: {
      kind: "network-device",
      id: 10n,
      interfaces: [{ name: "port", id: 11n }],
    },
  };
  const entities = indexEntities([record]);
  expect(entities.get(10n)).toMatchObject({ kind: "network-device", pointer: "/id", record });
  expect(entities.get(11n)).toMatchObject({
    kind: "interface",
    pointer: "/interfaces/0/id",
    record,
    networkInterface: record.data.interfaces[0],
  });
  expect(indexEntities([{ file: "empty.yaml", data: {} }])).toEqual(new Map());
});
