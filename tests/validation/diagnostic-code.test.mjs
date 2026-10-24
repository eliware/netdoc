import { expect, test } from "@jest/globals";
import { diagnosticCode } from "../../src/validation/diagnostic-code.mjs";

test.each([
  ["YAML parse error: broken input", "NETDOC_YAML_PARSE_ERROR"],
  ["This ID is in use at node.yaml#/id", "NETDOC_IDENTIFIER_DUPLICATE"],
  ["Reference 7 does not resolve to a network-segment.", "NETDOC_REFERENCE_INVALID"],
  ["Invalid network prefix '192.0.2.1/24'.", "NETDOC_NETWORK_PREFIX_INVALID"],
  ["Unclassified validation issue.", "NETDOC_VALIDATION_ERROR"],
])("assigns stable code for %s", (message, expected) => {
  expect(diagnosticCode(message)).toBe(expected);
});
