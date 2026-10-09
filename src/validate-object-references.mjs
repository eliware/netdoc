import { createDiagnostic } from "./diagnostics.mjs";

export function validateObjectReferences(record, entitiesById) {
  const { data } = record;
  const checks = [];
  if (data.kind === "virtual-machine")
    checks.push([data.residentOn, "/residentOn", ["physical-machine"]]);
  if (data.kind === "network-device")
    (data.residentOn ?? []).forEach((id, i) =>
      checks.push([id, `/residentOn/${i}`, ["physical-machine", "virtual-machine"]]),
    );
  const network = data.networking ?? {};
  (network.routing?.bgp?.peers ?? []).forEach(
    (peer, i) =>
      peer.peerId !== undefined &&
      checks.push([
        peer.peerId,
        `/networking/routing/bgp/peers/${i}/peerId`,
        ["physical-machine", "virtual-machine", "network-device"],
      ]),
  );
  (network.l2Announcements ?? []).forEach(
    (item, i) =>
      item.nodeId !== undefined &&
      checks.push([
        item.nodeId,
        `/networking/l2Announcements/${i}/nodeId`,
        ["physical-machine", "virtual-machine", "network-device"],
      ]),
  );
  (network.nat?.rules ?? []).forEach(
    (item, i) =>
      item.nodeId !== undefined &&
      checks.push([
        item.nodeId,
        `/networking/nat/rules/${i}/nodeId`,
        ["physical-machine", "virtual-machine", "network-device"],
      ]),
  );
  (network.loadBalancing?.listeners ?? []).forEach((listener, i) =>
    (listener.targets ?? []).forEach(
      (target, j) =>
        target.deviceId !== undefined &&
        checks.push([
          target.deviceId,
          `/networking/loadBalancing/listeners/${i}/targets/${j}/deviceId`,
          ["physical-machine", "virtual-machine", "network-device"],
        ]),
    ),
  );
  return checks.flatMap(([id, pointer, expected]) =>
    check(id, pointer, expected, record, entitiesById),
  );
}

function check(id, pointer, expected, record, entitiesById) {
  const target = entitiesById.get(id);
  if (target && expected.includes(target.kind)) return [];
  const actual = target?.kind ?? "no object";
  return [
    createDiagnostic(
      record.file,
      pointer,
      record.data.id,
      `Reference ${id} resolves to ${actual}; expected ${expected.join(" or ")}.`,
      "Use the ID of an existing object of the required type.",
    ),
  ];
}
