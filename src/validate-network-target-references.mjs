import { objectReferenceDiagnostics } from "./object-reference-diagnostics.mjs";

export function validateNetworkTargetReferences(record, entitiesById) {
  const network = record.data.networking ?? {};
  const expected = ["physical-machine", "virtual-machine", "network-device"];
  const checks = [];
  (network.l2Announcements ?? []).forEach(
    (item, i) =>
      item.nodeId !== undefined &&
      checks.push([item.nodeId, `/networking/l2Announcements/${i}/nodeId`, expected]),
  );
  (network.nat?.rules ?? []).forEach(
    (item, i) =>
      item.nodeId !== undefined &&
      checks.push([item.nodeId, `/networking/nat/rules/${i}/nodeId`, expected]),
  );
  (network.loadBalancing?.listeners ?? []).forEach((listener, i) =>
    (listener.targets ?? []).forEach(
      (target, j) =>
        target.deviceId !== undefined &&
        checks.push([
          target.deviceId,
          `/networking/loadBalancing/listeners/${i}/targets/${j}/deviceId`,
          expected,
        ]),
    ),
  );
  return objectReferenceDiagnostics(checks, record, entitiesById);
}
