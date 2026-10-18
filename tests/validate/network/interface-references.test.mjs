import { expect, test } from "@jest/globals";
import { validateNetworkInterfaceReferences } from "../../../src/validate/network/interface-references.mjs";

test("checks interface references in network settings", () => {
  const record = {
    file: "router.yaml",
    data: {
      id: 3n,
      interfaces: [{ name: "eth0" }],
      networking: {
        routing: { staticRoutes: [{ interfaceName: "missing" }] },
        tunnels: [{ interfaceName: "eth0" }],
        l2Announcements: [{ interfaceName: "remote" }],
      },
    },
  };
  expect(validateNetworkInterfaceReferences(record).map(({ pointer }) => pointer)).toEqual([
    "/networking/routing/staticRoutes/0/interfaceName",
  ]);
  expect(validateNetworkInterfaceReferences({ file: "empty.yaml", data: {} })).toEqual([]);
});
