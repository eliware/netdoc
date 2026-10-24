import { expect, test } from "@jest/globals";
import { routeInterfaceFields } from "../../../src/network/route/interfaces.mjs";

test("collects interface names from routes and VRRP groups", () => {
  expect(
    routeInterfaceFields({
      networking: {
        routing: {
          staticRoutes: [{ interfaceName: "eth0" }],
          vrrp: [{ interfaceName: "eth1" }],
        },
      },
    }),
  ).toEqual([
    ["/networking/routing/staticRoutes/0/interfaceName", "eth0"],
    ["/networking/routing/vrrp/0/interfaceName", "eth1"],
  ]);
});
