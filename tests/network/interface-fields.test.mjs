import { expect, test } from "@jest/globals";
import { localInterfaceFields } from "../../src/network/interface-fields.mjs";

test("collects local interface references", () => {
  expect(
    localInterfaceFields({
      networking: {
        routing: {
          staticRoutes: [{ interfaceName: "eth0" }, {}],
          vrrp: [{ interfaceName: "eth2" }],
        },
        tunnels: [{ interfaceName: "eth3" }],
        nat: { rules: [{ interfaceName: "eth5" }] },
        firewall: { zones: [{ interfaceNames: ["eth1"] }, {}] },
      },
    }),
  ).toHaveLength(5);
  expect(localInterfaceFields({})).toEqual([]);
});
