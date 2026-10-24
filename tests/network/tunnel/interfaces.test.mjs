import { expect, test } from "@jest/globals";
import { tunnelInterfaceFields } from "../../../src/network/tunnel/interfaces.mjs";

test("collects interface names from tunnel settings", () => {
  expect(tunnelInterfaceFields({ networking: { tunnels: [{ interfaceName: "wg0" }] } })).toEqual([
    ["/networking/tunnels/0/interfaceName", "wg0"],
  ]);
  expect(tunnelInterfaceFields({})).toEqual([]);
});
