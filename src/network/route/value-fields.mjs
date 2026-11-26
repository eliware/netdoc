export default function networkRouteValueFields(network) {
  const route = network.routing ?? {};
  const fields = [];
  const add = (path, value, isNetwork = false, options) =>
    fields.push(
      options === undefined ? [path, value, isNetwork] : [path, value, isNetwork, options],
    );
  add("/networking/routing/defaultGateway", route.defaultGateway);
  (route.staticRoutes ?? []).forEach((item, i) => {
    add(`/networking/routing/staticRoutes/${i}/destination`, item.destination, true);
    add(`/networking/routing/staticRoutes/${i}/nextHop`, item.nextHop, false, { hostOnly: true });
  });
  add("/networking/routing/bgp/routerId", route.bgp?.routerId, false, {
    hostOnly: true,
    ipv4: true,
  });
  (route.bgp?.advertisedPrefixes ?? []).forEach((value, i) =>
    add(`/networking/routing/bgp/advertisedPrefixes/${i}`, value, true),
  );
  (route.bgp?.peers ?? []).forEach((item, i) =>
    add(`/networking/routing/bgp/peers/${i}/address`, item.address, false, { hostOnly: true }),
  );
  return fields;
}
