import { expect, test } from "@jest/globals";
import { createGraphContext } from "../../src/graph/context.mjs";

test("indexes object and interface node IDs from records", () => {
  const record = { data: { id: 7n, interfaces: [{ id: 8n }] } };
  const context = createGraphContext([record]);
  expect(context.objectNodeByRecord.get(record)).toBe("object_0");
  expect(context.objectNodeById.get(7n)).toBe("object_0");
  expect(context.interfaceById.get(8n).nodeId).toBe("interface_0_0");
  expect(context.connectionKeys).toEqual(new Set());
});

test("keeps records without object or interface IDs", () => {
  const record = { data: { interfaces: [{}] } };
  const context = createGraphContext([record]);
  expect(context.objectNodeByRecord.get(record)).toBe("object_0");
  expect(context.interfaceById.size).toBe(0);
});
