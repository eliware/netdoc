import { validateLocalInterfaceNameFields } from "./validate-local-interface-name-fields.mjs";

export function validateSwitchPortReferences(record) {
  const names = new Set((record.data.interfaces ?? []).map(({ name }) => name));
  const fields = (record.data.switch?.ports ?? []).map((port, index) => [
    `/switch/ports/${index}/interfaceName`,
    port.interfaceName,
  ]);
  return validateLocalInterfaceNameFields(fields, record, names);
}
