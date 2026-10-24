import { addressInNetwork } from "../../network/address/membership.mjs";
import { edgeLine, nodeLine } from "../labels.mjs";

export function buildRouteElements(index, source, networking, context) {
  const nodes = [];
  const edges = [];
  addDefaultGateway(index, source, networking, context, nodes, edges);
  addStaticRoutes(index, source, networking, context, nodes, edges);
  return { nodes, edges };
}

function addDefaultGateway(index, source, networking, context, nodes, edges) {
  const address = networking.routing?.defaultGateway;
  if (!address) return;
  const segment = findSegment(context.records, (cidr) => addressInNetwork(address, cidr));
  if (segment) {
    edges.push(
      edgeLine(source, context.objectNodeByRecord.get(segment), `default gateway ${address}`),
    );
    return;
  }
  const target = `gateway_${index}`;
  nodes.push(nodeLine(target, ["Default gateway", address, "Segment unknown"]));
  edges.push(edgeLine(source, target, "default gateway"));
}

function addStaticRoutes(index, source, networking, context, nodes, edges) {
  (networking.routing?.staticRoutes ?? []).forEach((route, routeIndex) => {
    const segment = findSegment(context.records, (cidr) =>
      addressInNetwork(cidr, route.destination),
    );
    const via = route.nextHop ?? route.interfaceName ?? "unknown";
    if (segment) {
      edges.push(
        edgeLine(
          source,
          context.objectNodeByRecord.get(segment),
          `route ${route.destination} via ${via}`,
        ),
      );
      return;
    }
    const target = `route_${index}_${routeIndex}`;
    nodes.push(nodeLine(target, ["Static route", route.destination, `Next hop: ${via}`]));
    edges.push(edgeLine(source, target, "static route"));
  });
}

function findSegment(records, matchesNetwork) {
  return records.find(
    (record) =>
      record.data.kind === "network-segment" &&
      (record.data.ipNetworks ?? []).some(({ cidr }) => matchesNetwork(cidr)),
  );
}
