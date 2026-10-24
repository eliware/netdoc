export function switchPortSegmentFields(record) {
  return (record.data.switch?.ports ?? []).flatMap((port, index) => {
    const pointer = `/switch/ports/${index}`;
    const fields = [];
    if (port.segmentId !== undefined) fields.push([`${pointer}/segmentId`, port.segmentId]);
    (port.segmentIds ?? []).forEach((id, idIndex) =>
      fields.push([`${pointer}/segmentIds/${idIndex}`, id]),
    );
    if (port.pvidSegmentId !== undefined)
      fields.push([`${pointer}/pvidSegmentId`, port.pvidSegmentId]);
    return fields;
  });
}
