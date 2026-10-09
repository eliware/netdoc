import { createDiagnostic } from "./diagnostics.mjs";
import { parseAddress } from "./ip-addresses.mjs";

export function validateNetworkValues(records) {
  const diagnostics = [];
  for (const record of records) {
    for (const [pointer, value, network] of values(record.data)) {
      if (value !== undefined && !valid(value, network, pointer))
        diagnostics.push(
          createDiagnostic(
            record.file,
            pointer,
            record.data.id,
            `Invalid IP address or network '${value}'.`,
            "Use a valid IP address or network prefix.",
          ),
        );
    }
  }
  return diagnostics;
}

function valid(value, network, pointer) {
  if (typeof value !== "string") return false;
  if (value === "any" || (value === "masquerade" && pointer.endsWith("/translation"))) return true;
  const parsed = parseAddress(value);
  return Boolean(parsed && (!network || value.includes("/")));
}

function values(data) {
  const net = data.networking ?? {};
  const route = net.routing ?? {};
  const entries = [];
  const add = (path, value, network = false) => entries.push([path, value, network]);
  add("/networking/routing/defaultGateway", route.defaultGateway);
  (route.staticRoutes ?? []).forEach((item, i) => {
    add(`/networking/routing/staticRoutes/${i}/destination`, item.destination, true);
    add(`/networking/routing/staticRoutes/${i}/nextHop`, item.nextHop);
  });
  add("/networking/routing/bgp/routerId", route.bgp?.routerId);
  (route.bgp?.advertisedPrefixes ?? []).forEach((value, i) =>
    add(`/networking/routing/bgp/advertisedPrefixes/${i}`, value, true),
  );
  (route.bgp?.peers ?? []).forEach((item, i) =>
    add(`/networking/routing/bgp/peers/${i}/address`, item.address),
  );
  (route.vrrp ?? []).forEach((item, i) =>
    (item.virtualAddresses ?? []).forEach((value, j) =>
      add(`/networking/routing/vrrp/${i}/virtualAddresses/${j}`, value),
    ),
  );
  (net.l2Announcements ?? []).forEach((item, i) =>
    add(`/networking/l2Announcements/${i}/address`, item.address),
  );
  (net.tunnels ?? []).forEach((item, i) => {
    add(`/networking/tunnels/${i}/localAddress`, item.localAddress);
    (item.peers ?? []).forEach((peer, j) => {
      add(`/networking/tunnels/${i}/peers/${j}/endpointAddress`, peer.endpointAddress);
      (peer.allowedNetworks ?? []).forEach((value, k) =>
        add(`/networking/tunnels/${i}/peers/${j}/allowedNetworks/${k}`, value, true),
      );
    });
  });
  (net.firewall?.rules ?? []).forEach((item, i) => {
    add(`/networking/firewall/rules/${i}/source`, item.source);
    add(`/networking/firewall/rules/${i}/destination`, item.destination);
  });
  (net.nat?.rules ?? []).forEach((item, i) => {
    add(`/networking/nat/rules/${i}/source`, item.source);
    add(`/networking/nat/rules/${i}/destination`, item.destination);
    add(`/networking/nat/rules/${i}/translation`, item.translation);
  });
  (net.loadBalancing?.addressPools ?? []).forEach((pool, i) => {
    add(`/networking/loadBalancing/addressPools/${i}/cidr`, pool.cidr, true);
    add(`/networking/loadBalancing/addressPools/${i}/start`, pool.start);
    add(`/networking/loadBalancing/addressPools/${i}/end`, pool.end);
  });
  (net.loadBalancing?.listeners ?? []).forEach((listener, i) => {
    add(`/networking/loadBalancing/listeners/${i}/address`, listener.address);
    (listener.targets ?? []).forEach((target, j) =>
      add(`/networking/loadBalancing/listeners/${i}/targets/${j}/address`, target.address),
    );
  });
  (net.dhcp?.scopes ?? []).forEach((scope, i) => {
    add(`/networking/dhcp/scopes/${i}/network`, scope.network, true);
    add(`/networking/dhcp/scopes/${i}/rangeStart`, scope.rangeStart);
    add(`/networking/dhcp/scopes/${i}/rangeEnd`, scope.rangeEnd);
    add(`/networking/dhcp/scopes/${i}/gateway`, scope.gateway);
    (scope.reservations ?? []).forEach((reservation, j) =>
      add(`/networking/dhcp/scopes/${i}/reservations/${j}/address`, reservation.address),
    );
  });
  return entries;
}
