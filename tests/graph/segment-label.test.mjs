import { expect, test } from "@jest/globals";
import segmentLabel from "../../src/graph/segment-label.mjs";

test("labels wireless broadcasts and known interface addresses", () => {
  const networkInterface = {
    name: "radio0",
    addresses: [{ cidr: "192.0.2.1/24" }],
    wireless: { broadcasts: [{ wirelessNetworkId: 7n, segmentId: 3n }] },
  };
  const context = { recordById: new Map([[7n, { data: { name: "private5" } }]]) };
  expect(segmentLabel(networkInterface, 3n, context)).toBe(
    "radio0 / broadcast private5 / 192.0.2.1/24",
  );
  expect(segmentLabel(networkInterface, 4n, context)).toBe("radio0 / 192.0.2.1/24");
  expect(segmentLabel({}, 4n, { recordById: new Map() })).toBe("Interface");
});
