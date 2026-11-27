export default function buildAnsibleGroups(hosts) {
  const groups = new Map();
  for (const { machine, hostname } of hosts) {
    addGroup(groups, `netdoc_${machine.kind.replaceAll("-", "_")}`, machine.kind, hostname);
    addOperatingSystemGroup(groups, machine.operatingSystem, hostname);
    for (const role of machine.roles ?? [])
      addGroup(groups, `netdoc_role_${normalizeGroupValue(role)}`, role, hostname);
    for (const application of machine.applications ?? [])
      addGroup(
        groups,
        `netdoc_application_${normalizeGroupValue(application.name)}`,
        application.name,
        hostname,
      );
  }
  return Object.fromEntries([...groups].map(([name, group]) => [name, { hosts: group.hosts }]));
}

function addOperatingSystemGroup(groups, operatingSystem, hostname) {
  if (operatingSystem === undefined) return;
  const version = operatingSystem.version;
  const groupName = `netdoc_os_${normalizeGroupValue(operatingSystem.name)}${
    version === undefined ? "" : `_${normalizeGroupValue(version)}`
  }`;
  addGroup(groups, groupName, JSON.stringify([operatingSystem.name, version ?? null]), hostname);
}

function addGroup(groups, name, identity, hostname) {
  const existing = groups.get(name);
  if (existing && existing.identity !== identity)
    throw inventoryError(`Distinct values produce the same Ansible group name "${name}".`);
  if (existing) existing.hosts.push(hostname);
  else groups.set(name, { identity, hosts: [hostname] });
}

function normalizeGroupValue(value) {
  // Fixed prefixes keep group names nonempty when normalization removes the full value.
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function inventoryError(message) {
  const error = new Error(message);
  error.code = "NETDOC_ANSIBLE_INVENTORY_DATA";
  return error;
}
