export default function buildAnsibleInventory(records) {
  const machines = records
    .map(({ data }) => data)
    .filter(({ kind }) => kind === "physical-machine" || kind === "virtual-machine");
  const nameCounts = new Map();
  for (const machine of machines) {
    const key = machine.name.toLowerCase();
    nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
  }
  const hostnames = machines.map((machine) => {
    const duplicate = nameCounts.get(machine.name.toLowerCase()) > 1;
    if (duplicate && machine.id === undefined)
      throw inventoryError(`Machine name "${machine.name}" collides and the record has no ID.`);
    return duplicate ? `${machine.name}_${machine.id}` : machine.name;
  });
  rejectDuplicateHostnames(hostnames);

  const hostvars = Object.create(null);
  const groups = new Map();
  machines.forEach((machine, index) => {
    const hostname = hostnames[index];
    const uniqueName = nameCounts.get(machine.name.toLowerCase()) === 1;
    const variables = hostVariables(machine, uniqueName);
    hostvars[hostname] = variables;
    addGroup(groups, `netdoc_${machine.kind.replaceAll("-", "_")}`, machine.kind, hostname);
    addOperatingSystemGroup(groups, machine.operatingSystem, hostname);
    for (const role of machine.roles ?? [])
      addGroup(groups, `netdoc_role_${normalizeGroupValue(role)}`, role, hostname);
  });
  return {
    _meta: { hostvars },
    ...Object.fromEntries([...groups].map(([name, group]) => [name, { hosts: group.hosts }])),
  };
}

function hostVariables(machine, uniqueName) {
  const variables = {
    netdoc_name: machine.name,
    netdoc_kind: machine.kind,
  };
  if (uniqueName) variables.ansible_host = machine.name;
  if (machine.username !== undefined) variables.ansible_user = machine.username;
  if (machine.id !== undefined) variables.netdoc_id = String(machine.id);
  if (machine.roles !== undefined) variables.netdoc_roles = machine.roles;
  if (machine.operatingSystem !== undefined) {
    variables.netdoc_operating_system = {
      name: machine.operatingSystem.name,
      ...(machine.operatingSystem.version === undefined
        ? {}
        : { version: machine.operatingSystem.version }),
    };
  }
  return variables;
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

function rejectDuplicateHostnames(hostnames) {
  const seen = new Set();
  for (const hostname of hostnames) {
    const key = hostname.toLowerCase();
    if (seen.has(key))
      throw inventoryError(`Generated inventory hostname "${hostname}" is not unique.`);
    seen.add(key);
  }
}

function normalizeGroupValue(value) {
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
