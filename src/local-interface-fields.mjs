export function localInterfaceFields(data) {
  const network = data.networking ?? {};
  const routing = network.routing ?? {};
  const fields = [
    ...(routing.staticRoutes ?? []).map((item, i) => [
      `/networking/routing/staticRoutes/${i}/interfaceName`,
      item.interfaceName,
    ]),
    ...(routing.vrrp ?? []).map((item, i) => [
      `/networking/routing/vrrp/${i}/interfaceName`,
      item.interfaceName,
    ]),
    ...(network.tunnels ?? []).map((item, i) => [
      `/networking/tunnels/${i}/interfaceName`,
      item.interfaceName,
    ]),
    ...(network.l2Announcements ?? []).map((item, i) => [
      `/networking/l2Announcements/${i}/interfaceName`,
      item.interfaceName,
    ]),
    ...(network.nat?.rules ?? []).map((item, i) => [
      `/networking/nat/rules/${i}/interfaceName`,
      item.interfaceName,
    ]),
    ...(network.firewall?.zones ?? []).flatMap((zone, i) =>
      (zone.interfaceNames ?? []).map((name, j) => [
        `/networking/firewall/zones/${i}/interfaceNames/${j}`,
        name,
      ]),
    ),
  ];
  return fields.filter(([, name]) => name !== undefined);
}
