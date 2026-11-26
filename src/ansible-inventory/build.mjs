import buildAnsibleGroups from "./groups.mjs";
import buildAnsibleHosts from "./hosts.mjs";

export default function buildAnsibleInventory(records) {
  const { hosts, hostvars } = buildAnsibleHosts(records);
  return { _meta: { hostvars }, ...buildAnsibleGroups(hosts) };
}
