import { expect, test } from "@jest/globals";
import { renderMermaidGraph } from "../../src/graph/mermaid.mjs";

test("renders a Mermaid flowchart from inventory objects", () => {
  expect(
    renderMermaidGraph([
      { data: { kind: "physical-machine", name: "Host" } },
      { data: { kind: "network-segment", name: "LAN", vlan: "untagged", ipNetworks: [] } },
    ]),
  ).toBe(
    'flowchart LR\nobject_0["physical-machine<br/>Host"]\nobject_1["network-segment<br/>LAN<br/>VLAN: untagged"]',
  );
});
