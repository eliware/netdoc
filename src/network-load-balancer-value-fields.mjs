export function networkLoadBalancerValueFields(network) {
  const fields = [];
  const add = (path, value) => fields.push([path, value, false, { hostOnly: true }]);
  (network.loadBalancing?.listeners ?? []).forEach((listener, i) => {
    add(`/networking/loadBalancing/listeners/${i}/address`, listener.address);
    (listener.targets ?? []).forEach((target, j) =>
      add(`/networking/loadBalancing/listeners/${i}/targets/${j}/address`, target.address),
    );
  });
  return fields;
}
