import { expect, test } from "@jest/globals";
import { localInterfaceFields } from "../src/local-interface-fields.mjs";

test("collects local interface references", () => {
  expect(
    localInterfaceFields({
      networking: {
        routing: {
          staticRoutes: [{ interfaceName: "eth0" }, {}],
          vrrp: [{ interfaceName: "eth2" }],
        },
        tunnels: [{ interfaceName: "eth3" }],
        l2Announcements: [{ interfaceName: "eth4" }],
        nat: { rules: [{ interfaceName: "eth5" }] },
        firewall: { zones: [{ interfaceNames: ["eth1"] }, {}] },
      },
    }),
  ).toHaveLength(6);
  expect(localInterfaceFields({})).toEqual([]);
});
