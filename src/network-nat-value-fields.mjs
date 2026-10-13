export function networkNatValueFields(network) {
  const fields = [];
  const add = (path, value, options) =>
    fields.push(options ? [path, value, false, options] : [path, value, false]);
  (network.nat?.rules ?? []).forEach((item, i) => {
    add(`/networking/nat/rules/${i}/source`, item.source, { allowAny: true });
    add(`/networking/nat/rules/${i}/destination`, item.destination, { allowAny: true });
    add(`/networking/nat/rules/${i}/translation`, item.translation);
  });
  return fields;
}
