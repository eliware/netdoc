export function networkTunnelValueFields(network) {
  const fields = [];
  const add = (path, value, isNetwork = false) => fields.push([path, value, isNetwork]);
  (network.tunnels ?? []).forEach((item, i) => {
    add(`/networking/tunnels/${i}/localAddress`, item.localAddress);
    (item.peers ?? []).forEach((peer, j) => {
      add(`/networking/tunnels/${i}/peers/${j}/endpointAddress`, peer.endpointAddress);
      (peer.allowedNetworks ?? []).forEach((value, k) =>
        add(`/networking/tunnels/${i}/peers/${j}/allowedNetworks/${k}`, value, true),
      );
    });
  });
  return fields;
}
