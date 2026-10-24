import { expect, test } from "@jest/globals";
import { policyInterfaceFields } from "../../../src/network/policy/interfaces.mjs";

test("collects interface names from NAT rules and firewall zones", () => {
  expect(
    policyInterfaceFields({
      networking: {
        nat: { rules: [{ interfaceName: "eth2" }] },
        firewall: { zones: [{ interfaceNames: ["eth3"] }] },
      },
    }),
  ).toEqual([
    ["/networking/nat/rules/0/interfaceName", "eth2"],
    ["/networking/firewall/zones/0/interfaceNames/0", "eth3"],
  ]);
  expect(policyInterfaceFields({})).toEqual([]);
});
