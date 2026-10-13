import { validateAccessSwitchPorts } from "./validate-access-switch-ports.mjs";
import { validateTrunkSwitchPorts } from "./validate-trunk-switch-ports.mjs";

export function validateSwitchPorts(records, entitiesById) {
  return [
    ...validateAccessSwitchPorts(records),
    ...validateTrunkSwitchPorts(records, entitiesById),
  ];
}
