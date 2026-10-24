const codes = [
  [/^YAML parse error:/, "NETDOC_YAML_PARSE_ERROR"],
  [/^The YAML document must contain one object\./, "NETDOC_YAML_DOCUMENT_INVALID"],
  [/^Missing or unsupported object type\./, "NETDOC_KIND_UNSUPPORTED"],
  [/^This ID is in use at /, "NETDOC_IDENTIFIER_DUPLICATE"],
  [/^The ID is outside /, "NETDOC_IDENTIFIER_RANGE"],
  [/^Reference /, "NETDOC_REFERENCE_INVALID"],
  [/^Invalid network prefix /, "NETDOC_NETWORK_PREFIX_INVALID"],
  [/^Gateway /, "NETDOC_GATEWAY_INVALID"],
  [/^Invalid IP address or network /, "NETDOC_ADDRESS_INVALID"],
  [/^MAC address .* is in use at /, "NETDOC_MAC_ADDRESS_DUPLICATE"],
  [/^Address .* is in use at /, "NETDOC_ADDRESS_CONFLICT"],
  [/^An interface cannot connect to itself\./, "NETDOC_CONNECTION_SELF"],
  [/^Peer interface .* does not reference interface /, "NETDOC_CONNECTION_NOT_RECIPROCAL"],
  [/^This .* repeats an earlier reference\./, "NETDOC_REFERENCE_DUPLICATE"],
];

export function diagnosticCode(message) {
  return codes.find(([pattern]) => pattern.test(message))?.[1] ?? "NETDOC_VALIDATION_ERROR";
}
