import { createDiagnostic } from "./diagnostics.mjs";

export function validateConnections(records, entitiesById) {
  return records.flatMap((record) => {
    const diagnostics = [];
    for (const [index, networkInterface] of (record.data.interfaces ?? []).entries()) {
      const peerId = networkInterface.connectsTo;
      if (peerId === undefined || typeof networkInterface.id !== "bigint") continue;
      const pointer = `/interfaces/${index}/connectsTo`;
      if (peerId === networkInterface.id) {
        diagnostics.push(
          createDiagnostic(
            record.file,
            pointer,
            record.data.id,
            "An interface cannot connect to itself.",
            "Reference the peer interface ID.",
          ),
        );
        continue;
      }
      const peer = entitiesById.get(peerId);
      if (peer?.invalid) continue;
      if (!peer) {
        diagnostics.push(
          createDiagnostic(
            record.file,
            pointer,
            record.data.id,
            `Reference ${peerId} does not resolve to an interface.`,
            "Use the ID of an existing peer interface.",
          ),
        );
        continue;
      }
      if (peer.kind !== "interface") {
        diagnostics.push(
          createDiagnostic(
            record.file,
            pointer,
            record.data.id,
            `Reference ${peerId} resolves to ${peer.kind}; expected interface.`,
            "Use the ID of an interface.",
          ),
        );
        continue;
      }
      if (peer.networkInterface.connectsTo !== networkInterface.id) {
        diagnostics.push(
          createDiagnostic(
            record.file,
            pointer,
            record.data.id,
            `Peer interface ${peerId} does not link back to ${networkInterface.id}.`,
            "Set connectsTo on both interfaces to the other interface ID.",
          ),
        );
      }
    }
    return diagnostics;
  });
}
