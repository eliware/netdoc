export function normalizeMacAddress(address) {
  return address.toLowerCase().replaceAll("-", ":");
}
