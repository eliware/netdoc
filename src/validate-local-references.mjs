import { createDiagnostic } from "./diagnostics.mjs";
import { localInterfaceFields } from "./local-interface-fields.mjs";
export function validateLocalReferences(record) {
  const diagnostics = [];
  const interfaces = record.data.interfaces ?? [];
  const names = new Map(interfaces.map((item, index) => [item.name, index]));
  for (const [index, networkInterface] of interfaces.entries()) {
    const pointer = `/interfaces/${index}`;
    if (names.get(networkInterface.name) !== index)
      diagnostics.push(
        problem(
          record,
          `${pointer}/name`,
          "Interface name is duplicated.",
          "Give each interface a unique name within this record.",
        ),
      );
    checkName(
      networkInterface.parentInterface,
      record,
      `${pointer}/parentInterface`,
      names,
      diagnostics,
    );
  }
  for (const [index, port] of (record.data.switch?.ports ?? []).entries()) {
    const pointer = `/switch/ports/${index}`;
    checkName(port.interfaceName, record, `${pointer}/interfaceName`, names, diagnostics);
  }
  for (const [pointer, name] of localInterfaceFields(record.data).filter(
    ([pointer]) => !pointer.startsWith("/networking/l2Announcements/"),
  ))
    checkName(name, record, pointer, names, diagnostics);
  return diagnostics;
}

function checkName(name, record, pointer, names, diagnostics) {
  if (name !== undefined && !names.has(name))
    diagnostics.push(
      problem(
        record,
        pointer,
        `Interface name '${name}' does not exist in this record.`,
        "Use the name of an interface in this record.",
      ),
    );
}

function problem(record, pointer, message, suggestion) {
  return createDiagnostic(record.file, pointer, record.data.id, message, suggestion);
}
