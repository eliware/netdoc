export function networkAnnouncementFirewallValueFields(network) {
  const fields = [];
  const add = (path, value) => fields.push([path, value, false]);
  (network.l2Announcements ?? []).forEach((item, i) =>
    add(`/networking/l2Announcements/${i}/address`, item.address),
  );
  (network.firewall?.rules ?? []).forEach((item, i) => {
    add(`/networking/firewall/rules/${i}/source`, item.source);
    add(`/networking/firewall/rules/${i}/destination`, item.destination);
  });
  return fields;
}
