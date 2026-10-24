export function policyInterfaceFields(data) {
  const network = data.networking ?? {};
  return [
    ...(network.nat?.rules ?? []).map((item, index) => [
      `/networking/nat/rules/${index}/interfaceName`,
      item.interfaceName,
    ]),
    ...(network.firewall?.zones ?? []).flatMap((zone, index) =>
      (zone.interfaceNames ?? []).map((name, nameIndex) => [
        `/networking/firewall/zones/${index}/interfaceNames/${nameIndex}`,
        name,
      ]),
    ),
  ];
}
