export function dhcpScopeFields(network) {
  const fields = [];
  const add = (path, value, isNetwork = false) => fields.push([path, value, isNetwork]);
  (network.dhcp?.scopes ?? []).forEach((scope, i) => {
    add(`/networking/dhcp/scopes/${i}/network`, scope.network, true);
    add(`/networking/dhcp/scopes/${i}/rangeStart`, scope.rangeStart);
    add(`/networking/dhcp/scopes/${i}/rangeEnd`, scope.rangeEnd);
    add(`/networking/dhcp/scopes/${i}/gateway`, scope.gateway);
    (scope.reservations ?? []).forEach((reservation, j) =>
      add(`/networking/dhcp/scopes/${i}/reservations/${j}/address`, reservation.address),
    );
  });
  return fields;
}
