import { createDiagnostic } from "./diagnostics.mjs";

export function validateAccessSwitchPorts(records) {
  const diagnostics = [];
  for (const record of records) {
    const interfaces = new Map((record.data.interfaces ?? []).map((item) => [item.name, item]));
    for (const [index, port] of (record.data.switch?.ports ?? []).entries()) {
      if (port.mode !== "access") continue;
      const networkInterface = interfaces.get(port.interfaceName);
      if (
        networkInterface?.segmentId !== undefined &&
        networkInterface.segmentId !== port.segmentId
      ) {
        diagnostics.push(
          createDiagnostic(
            record.file,
            `/switch/ports/${index}/segmentId`,
            record.data.id,
            "Access port and interface use different segments.",
            "Use the same segment ID on the access port and interface.",
          ),
        );
      }
    }
  }
  return diagnostics;
}
