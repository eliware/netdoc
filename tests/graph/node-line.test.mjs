import { expect, test } from "@jest/globals";
import nodeLine from "../../src/graph/node-line.mjs";

test("formats Mermaid node labels", () => {
  expect(nodeLine("node_1", ["Router", "eth0"])).toBe('node_1["Router<br/>eth0"]');
});
