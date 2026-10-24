import { expect, test } from "@jest/globals";
import { findEndpointInterface } from "../../../src/graph/networking/endpoint-interfaces.mjs";

test("finds one matching host interface address", () => {
  const context = {
    records: [
      {
        data: {
          interfaces: [{ addresses: [{ cidr: "203.0.113.2/24" }] }],
        },
      },
    ],
  };

  expect(findEndpointInterface("203.0.113.2", context)).toBe("interface_0_0");
});

test("skips invalid, prefixed, and ambiguous endpoint addresses", () => {
  const context = {
    records: [
      { data: { interfaces: [{ addresses: [{ cidr: "203.0.113.2/24" }] }] } },
      { data: { interfaces: [{ addresses: [{ cidr: "203.0.113.2/32" }] }] } },
    ],
  };

  expect(findEndpointInterface("bad", context)).toBeUndefined();
  expect(findEndpointInterface("203.0.113.2/24", context)).toBeUndefined();
  expect(findEndpointInterface("203.0.113.2", context)).toBeUndefined();
});
