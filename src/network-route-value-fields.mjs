export function networkRouteValueFields(network) {
  const route = network.routing ?? {};
  const fields = [];
  const add = (path, value, isNetwork = false) => fields.push([path, value, isNetwork]);
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
  return fields;
}
