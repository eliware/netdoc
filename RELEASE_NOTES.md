# Release Notes

## 12.0.0 — 2026-10-13

### Added

- Add a CLI guide for installation, commands, validation, errors, and package contents.
- Add published specification files and load schemas from `specs/schema/`.

### Changed

- Use `@eliware/test` v12 for project checks and package validation.
- Use v12 of `@eliware/common` and `@eliware/snowflake`.
- Include `specs/` in the published package.
- Apply the Eliware repository conventions to project files and workflows.
- Set the Knit deployment path to `/eliware/netdoc` and the timeout to five minutes.
- Write end-user documentation in clear, direct language.
- Split validator and schema code into focused modules with matching tests.
- Keep complete test coverage for the validator modules.

### Fixed

- Skip follow-on reference errors for records that already have schema errors.
- Normalize MAC addresses before NetDoc checks DHCP lease and reservation pairs.
- Check trunk PVID segments for untagged VLAN use.
- Reject CIDR prefixes in load balancer pool range endpoints.
- Detect overlapping network ranges on each segment.
- Allow distinct host addresses inside the same subnet.
- Tighten checks for NAT values, IDs, interfaces, segments, and network values.

## 11.0.0 — 2026-10-09

### Added

- Add YAML schemas for physical machines, virtual machines, network devices, and network segments.
- Add schema rules for IDs, references, hardware, storage, and interfaces.
- Add network fields for routes, BGP, tunnels, firewall, NAT, address pools, DHCP, and Layer 2 announcements.
- Add switch fields for access ports, trunk ports, VLANs, PVIDs, and internal ports.
- Add a read-only `netdoc` command for help, version, YAML checks, and Snowflake IDs.
- Add `-n COUNT` to print several Snowflake IDs in one command.
- Check YAML syntax and object schemas before cross-file checks.
- Check positive signed 64-bit IDs and unique IDs across objects and interfaces.
- Check object, interface, machine-host, and network-peer references.
- Check reciprocal interface links and local interface names.
- Check switch ports, segment links, VLANs, tagged segments, and PVIDs.
- Check duplicate IP and MAC addresses on each network segment.
- Check interface addresses against segment networks. Check network prefixes and gateways.
- Report each error with its file and YAML path. Add an object ID and correction hint when known.
- Keep validation read-only. Do not connect to networks or write inventory files.
- Add user guidance and tests for the schemas and CLI.
