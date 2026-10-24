export function routeInterfaceFields(data) {
  const routing = data.networking?.routing ?? {};
  return [
    ...(routing.staticRoutes ?? []).map((item, index) => [
      `/networking/routing/staticRoutes/${index}/interfaceName`,
      item.interfaceName,
    ]),
    ...(routing.vrrp ?? []).map((item, index) => [
      `/networking/routing/vrrp/${index}/interfaceName`,
      item.interfaceName,
    ]),
  ];
}
