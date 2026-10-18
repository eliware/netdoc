export function networkVrrpValueFields(network) {
  const fields = [];
  (network.routing?.vrrp ?? []).forEach((item, i) =>
    (item.virtualAddresses ?? []).forEach((value, j) =>
      fields.push([`/networking/routing/vrrp/${i}/virtualAddresses/${j}`, value, false]),
    ),
  );
  return fields;
}
