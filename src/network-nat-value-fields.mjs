export function networkNatValueFields(network) {
  const fields = [];
  const add = (path, value) => fields.push([path, value, false]);
  (network.nat?.rules ?? []).forEach((item, i) => {
    add(`/networking/nat/rules/${i}/source`, item.source);
    add(`/networking/nat/rules/${i}/destination`, item.destination);
    add(`/networking/nat/rules/${i}/translation`, item.translation);
  });
  return fields;
}
