import { addressInNetwork } from "./address/membership.mjs";
import { parseAddress } from "../ip-addresses.mjs";

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
