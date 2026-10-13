import { parseAddress } from "./ip-addresses.mjs";

export function addressInNetwork(address, network) {
  const parsedAddress = parseAddress(address);
  const parsedNetwork = parseAddress(network);
  return Boolean(
    parsedAddress &&
    parsedNetwork &&
    parsedAddress.version === parsedNetwork.version &&
    parsedAddress.integer >> BigInt(parsedAddress.bits - parsedNetwork.prefix) ===
      parsedNetwork.integer >> BigInt(parsedNetwork.bits - parsedNetwork.prefix),
  );
}

export function prefixInNetwork(prefix, network) {
  const parsedPrefix = parseAddress(prefix);
  const parsedNetwork = parseAddress(network);
  return Boolean(
    parsedPrefix &&
    parsedNetwork &&
    parsedPrefix.prefix >= parsedNetwork.prefix &&
    addressInNetwork(prefix, network),
  );
}
