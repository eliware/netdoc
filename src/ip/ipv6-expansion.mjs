export function expandIpv4EmbeddedIpv6(address) {
  if (!address.includes(".")) return address;
  const lastColon = address.lastIndexOf(":");
  const octets = address
    .slice(lastColon + 1)
    .split(".")
    .map(Number);
  const high = (octets[0] * 256 + octets[1]).toString(16);
  const low = (octets[2] * 256 + octets[3]).toString(16);
  return `${address.slice(0, lastColon)}:${high}:${low}`;
}
