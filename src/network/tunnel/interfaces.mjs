export function tunnelInterfaceFields(data) {
  return (data.networking?.tunnels ?? []).map((item, index) => [
    `/networking/tunnels/${index}/interfaceName`,
    item.interfaceName,
  ]);
}
