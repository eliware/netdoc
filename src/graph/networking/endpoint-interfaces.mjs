import { parseAddress } from "../../ip-addresses.mjs";

export function findEndpointInterface(address, context) {
  const endpoint = parseAddress(address);
  if (!endpoint || endpoint.prefix !== endpoint.bits) return undefined;
  const matches = [];
  context.records.forEach((record, recordIndex) => {
    (record.data.interfaces ?? []).forEach((networkInterface, interfaceIndex) => {
      const hasAddress = (networkInterface.addresses ?? []).some(({ cidr }) => {
        const candidate = parseAddress(cidr);
        return (
          candidate &&
          candidate.version === endpoint.version &&
          candidate.integer === endpoint.integer
        );
      });
      if (hasAddress) matches.push(`interface_${recordIndex}_${interfaceIndex}`);
    });
  });
  return matches.length === 1 ? matches[0] : undefined;
}
