export default function normalizeMacAddress(address) {
  return address.toLowerCase().replaceAll("-", ":");
}
