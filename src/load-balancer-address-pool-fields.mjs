export function loadBalancerAddressPoolFields(network) {
  const fields = [];
  const add = (path, value, isNetwork, options) => fields.push([path, value, isNetwork, options]);
  (network.loadBalancing?.addressPools ?? []).forEach((pool, i) => {
    add(`/networking/loadBalancing/addressPools/${i}/cidr`, pool.cidr, true);
    add(`/networking/loadBalancing/addressPools/${i}/start`, pool.start, false, { hostOnly: true });
    add(`/networking/loadBalancing/addressPools/${i}/end`, pool.end, false, { hostOnly: true });
  });
  return fields;
}
