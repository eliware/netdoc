export default function isAllowedVirtualSharing(previous, addressAssignment, range) {
  return (
    previous.assignment === "virtual" &&
    addressAssignment.assignment === "virtual" &&
    previous.range.start === range.start &&
    previous.range.end === range.end
  );
}
