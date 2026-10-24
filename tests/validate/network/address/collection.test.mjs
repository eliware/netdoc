import { expect, test } from "@jest/globals";
import { validateNetworkAddressValues } from "../../../../src/validate/network/address/collection.mjs";

test("collects network address fields and reports their source locations", () => {
  const record = {
    file: "router.yaml",
    data: {
      id: 7n,
      networking: {
        routing: { defaultGateway: "bad" },
        dhcp: { scopes: [{ network: "bad" }] },
      },
    },
  };

  expect(validateNetworkAddressValues(record)).toMatchObject([
    {
      file: "router.yaml",
      pointer: "/networking/routing/defaultGateway",
      objectId: 7n,
      message: "Invalid IP address or network 'bad'.",
    },
    {
      file: "router.yaml",
      pointer: "/networking/dhcp/scopes/0/network",
      objectId: 7n,
      message: "Invalid IP address or network 'bad'.",
    },
  ]);
});
