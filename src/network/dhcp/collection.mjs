import dhcpScopeFields from "./value-fields.mjs";

export default function collectDhcpFields(network) {
  return dhcpScopeFields(network.dhcp ?? {});
}
