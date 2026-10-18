import { expect, test } from "@jest/globals";
import { validateSegmentNetworkPrefix } from "../../../src/validate/segment/network-prefix.mjs";

test("accepts a valid prefix and reports an invalid prefix", () => {
  const record = { file: "segment.yaml", data: { id: 1n } };
  expect(validateSegmentNetworkPrefix(record, { cidr: "192.0.2.0/24" }, 0)).toEqual([]);
  expect(
    validateSegmentNetworkPrefix(record, { cidr: "bad" }, 1).map(({ pointer }) => pointer),
  ).toEqual(["/ipNetworks/1/cidr"]);
  expect(
    validateSegmentNetworkPrefix(record, { cidr: "192.0.2.0" }, 2).map(({ pointer }) => pointer),
  ).toEqual(["/ipNetworks/2/cidr"]);
});
