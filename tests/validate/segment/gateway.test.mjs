import { expect, test } from "@jest/globals";
import { validateSegmentGateway } from "../../../src/validate/segment/gateway.mjs";

test("accepts an in-network gateway and reports an outside gateway", () => {
  const record = { file: "segment.yaml", data: { id: 1n } };
  const network = { cidr: "192.0.2.0/24" };
  expect(validateSegmentGateway(record, { ...network, gateway: "192.0.2.1" }, 0)).toEqual([]);
  expect(validateSegmentGateway(record, { ...network, gateway: "192.0.2.1/24" }, 6)).toEqual([]);
  expect(
    validateSegmentGateway(record, { ...network, gateway: "192.0.3.1" }, 1).map(
      ({ pointer }) => pointer,
    ),
  ).toEqual(["/ipNetworks/1/gateway"]);
  expect(
    validateSegmentGateway(record, { ...network, gateway: "" }, 3).map(({ pointer }) => pointer),
  ).toEqual(["/ipNetworks/3/gateway"]);
  expect(
    validateSegmentGateway(record, { ...network, gateway: "bad/1" }, 5).map(
      ({ pointer }) => pointer,
    ),
  ).toEqual(["/ipNetworks/5/gateway"]);
  expect(
    validateSegmentGateway(record, { cidr: "192.0.2.0/24", gateway: "2001:db8::1" }, 4).map(
      ({ pointer }) => pointer,
    ),
  ).toEqual(["/ipNetworks/4/gateway"]);
});

test("skips a missing gateway", () => {
  expect(
    validateSegmentGateway({ file: "segment.yaml", data: { id: 1n } }, { cidr: "192.0.2.0/24" }, 0),
  ).toEqual([]);
});
