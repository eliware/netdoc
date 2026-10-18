import { createDiagnostic } from "../diagnostics.mjs";

export function validateDuplicateInterfaceNames(record) {
  const interfaces = record.data.interfaces ?? [];
  const names = new Map(interfaces.map((item, index) => [item.name, index]));
  return interfaces.flatMap((networkInterface, index) =>
    names.get(networkInterface.name) === index
      ? []
      : [
          createDiagnostic(
            record.file,
            `/interfaces/${index}/name`,
            record.data.id,
            "Interface name is duplicated.",
            "Give each interface a unique name in this record.",
          ),
        ],
  );
}
