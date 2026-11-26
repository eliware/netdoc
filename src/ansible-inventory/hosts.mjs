export default function buildAnsibleHosts(records) {
  const machines = records
    .map(({ data }) => data)
    .filter(({ kind }) => kind === "physical-machine" || kind === "virtual-machine");
  const nameCounts = new Map();
  for (const machine of machines) {
    const key = machine.name.toLowerCase();
    nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
  }
  const hosts = machines.map((machine) => {
    const duplicate = nameCounts.get(machine.name.toLowerCase()) > 1;
    if (duplicate && machine.id === undefined)
      throw inventoryError(`Machine name "${machine.name}" collides and the record has no ID.`);
    return {
      machine,
      hostname: duplicate ? `${machine.name}_${machine.id}` : machine.name,
      uniqueName: !duplicate,
    };
  });
  // Check after adding suffixes so generated names also collide with existing hostnames.
  rejectDuplicateHostnames(hosts.map(({ hostname }) => hostname));

  const hostvars = Object.create(null);
  for (const { machine, hostname, uniqueName } of hosts)
    hostvars[hostname] = hostVariables(machine, uniqueName);
  return { hosts, hostvars };
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

function rejectDuplicateHostnames(hostnames) {
  // Ansible keys preserve case, so reject names that collide after case folding.
  const seen = new Set();
  for (const hostname of hostnames) {
    const key = hostname.toLowerCase();
    if (seen.has(key))
      throw inventoryError(`Generated inventory hostname "${hostname}" is not unique.`);
    seen.add(key);
  }
}

function inventoryError(message) {
  const error = new Error(message);
  error.code = "NETDOC_ANSIBLE_INVENTORY_DATA";
  return error;
}
