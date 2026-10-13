export function networkPolicyValueFields(network) {
  const fields = [];
  const add = (path, value) => fields.push([path, value, false]);
  (network.l2Announcements ?? []).forEach((item, i) =>
    add(`/networking/l2Announcements/${i}/address`, item.address),
  );
  (network.firewall?.rules ?? []).forEach((item, i) => {
    add(`/networking/firewall/rules/${i}/source`, item.source);
    add(`/networking/firewall/rules/${i}/destination`, item.destination);
  });
  (network.nat?.rules ?? []).forEach((item, i) => {
    add(`/networking/nat/rules/${i}/source`, item.source);
    add(`/networking/nat/rules/${i}/destination`, item.destination);
    add(`/networking/nat/rules/${i}/translation`, item.translation);
  });
  (network.loadBalancing?.listeners ?? []).forEach((listener, i) => {
    add(`/networking/loadBalancing/listeners/${i}/address`, listener.address);
    (listener.targets ?? []).forEach((target, j) =>
      add(`/networking/loadBalancing/listeners/${i}/targets/${j}/address`, target.address),
    );
  });
  return fields;
}
