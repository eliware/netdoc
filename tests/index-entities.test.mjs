import { expect, test } from "@jest/globals";
import { indexEntities } from "../src/index-entities.mjs";

test("combines object and interface indexes and preserves invalid records", () => {
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
  const invalid = {
    file: "invalid.yaml",
    data: { kind: "physical-machine", id: 12n, interfaces: [null, { id: 13n, name: "eth0" }] },
  };
  const withInvalid = indexEntities([record], [invalid]);
  expect(withInvalid.get(12n)).toMatchObject({ invalid: true, kind: "physical-machine" });
  expect(withInvalid.get(13n)).toMatchObject({ invalid: true, kind: "interface" });
  expect(indexEntities([{ file: "empty.yaml", data: {} }])).toEqual(new Map());
});
