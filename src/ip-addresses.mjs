import { isIP } from "node:net";

export function parseAddress(value) {
  if (typeof value !== "string") return undefined;
  const [address, prefixText, extra] = value.split("/");
  if (extra !== undefined || isIP(address) === 0) return undefined;
  const version = isIP(address);
  const bits = version === 4 ? 32 : 128;
  const prefix = prefixText === undefined ? bits : Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > bits) return undefined;
  const integer = version === 4 ? parseIpv4(address) : parseIpv6(address);
  return { version, bits, prefix, integer, first: integer >> BigInt(bits - prefix), text: address };
}

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

export function sameAddress(left, right) {
  const first = parseAddress(left);
  const second = parseAddress(right);
  return Boolean(
    first && second && first.version === second.version && first.integer === second.integer,
  );
}

function parseIpv4(address) {
  return address.split(".").reduce((value, part) => (value << 8n) | BigInt(part), 0n);
}

function parseIpv6(address) {
  const halves = address.split("::");
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length > 1 && halves[1] ? halves[1].split(":") : [];
  const groups = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
  return groups.reduce((value, group) => (value << 16n) | BigInt(`0x${group}`), 0n);
}
