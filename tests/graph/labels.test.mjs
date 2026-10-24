import { expect, test } from "@jest/globals";
import { edgeLine, escapeMermaidText, nodeLine } from "../../src/graph/labels.mjs";

test("escapes Mermaid text and formats nodes and edges", () => {
  expect(escapeMermaidText('A "B" & C | D\nE')).toBe("A &quot;B&quot; &amp; C &#124; D E");
  expect(escapeMermaidText("router[wan] (uplink)")).toBe("router&#91;wan&#93; &#40;uplink&#41;");
  expect(escapeMermaidText("router{wan}")).toBe("router&#123;wan&#125;");
  expect(escapeMermaidText(undefined)).toBe("");
  expect(nodeLine("node_1", ["Router", "eth0"])).toBe('node_1["Router<br/>eth0"]');
  expect(edgeLine("node_1", "node_2", "uplink", "---")).toBe("node_1 ---|uplink| node_2");
});
