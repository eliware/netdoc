import { policyInterfaceFields } from "./policy/interfaces.mjs";
import { routeInterfaceFields } from "./route/interfaces.mjs";
import { tunnelInterfaceFields } from "./tunnel/interfaces.mjs";

export function localInterfaceFields(data) {
  return [
    ...routeInterfaceFields(data),
    ...tunnelInterfaceFields(data),
    ...policyInterfaceFields(data),
  ].filter(([, name]) => name !== undefined);
}
