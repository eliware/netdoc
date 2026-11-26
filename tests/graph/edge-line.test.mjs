import { expect, test } from "@jest/globals";
import edgeLine from "../../src/graph/edge-line.mjs";

test("formats Mermaid edges", () => {
  expect(edgeLine("node_1", "node_2", "uplink", "---")).toBe("node_1 ---|uplink| node_2");
});
