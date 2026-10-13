export function loadBalancerAddressPoolFields(network) {
  const fields = [];
  const add = (path, value, isNetwork = false) => fields.push([path, value, isNetwork]);
  (network.loadBalancing?.addressPools ?? []).forEach((pool, i) => {
    add(`/networking/loadBalancing/addressPools/${i}/cidr`, pool.cidr, true);
    add(`/networking/loadBalancing/addressPools/${i}/start`, pool.start);
    add(`/networking/loadBalancing/addressPools/${i}/end`, pool.end);
  });
  return fields;
}
