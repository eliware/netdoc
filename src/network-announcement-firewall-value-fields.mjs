export function networkAnnouncementFirewallValueFields(network) {
  const fields = [];
  const add = (path, value, options) =>
    fields.push(options ? [path, value, false, options] : [path, value, false]);
  (network.l2Announcements ?? []).forEach((item, i) =>
    add(`/networking/l2Announcements/${i}/address`, item.address),
  );
  (network.firewall?.rules ?? []).forEach((item, i) => {
    add(`/networking/firewall/rules/${i}/source`, item.source, { allowAny: true });
    add(`/networking/firewall/rules/${i}/destination`, item.destination, { allowAny: true });
  });
  return fields;
}
