import { expect, test } from "@jest/globals";
import { buildListenerElements } from "../../../src/graph/networking/listeners.mjs";

test("renders configured listeners and optional addresses", () => {
  expect(
    buildListenerElements(1, "object_1", {
      listeners: [
        { label: "Mail SMTP", protocol: "TCP", port: 25, address: "192.0.2.10" },
        { protocol: "UDP", port: 53 },
      ],
    }),
  ).toEqual({
    nodes: [
      'service_listener_1_0["Mail SMTP<br/>TCP:25<br/>Address: 192.0.2.10"]',
      'service_listener_1_1["Configured listener<br/>UDP:53"]',
    ],
    edges: [
      "object_1 -->|listener| service_listener_1_0",
      "object_1 -->|listener| service_listener_1_1",
    ],
  });
});
