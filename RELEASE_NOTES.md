# Release Notes

## 15.0.0 — 2026-10-24

### Added

- Add a report command that marks inventory source age as current or stale.
- Add a Mermaid topology command for network inventory.
- Add JSON output for validation results.
- Add Layer 2 port schemas for access ports, trunk ports, VLANs, PVIDs, and internal router ports.
- Add wireless schemas for SSIDs, radios, client profiles, management state, and controller references.
- Add DNS names linked to interface addresses.
- Add configured MTU values with positive 32-bit byte limits on interfaces.
- Add schema and validator checks for network references, interface addresses, port modes, and VLAN assignments.
- Add checks for wireless references, unique profiles, unique radio entries, and unique DNS names.
- Add mixed WPA2/WPA3 personal and enterprise wireless modes.
- Add VXLAN overlay fields for network segments, underlays, endpoints, transport settings, MTU, and encryption state.
- Validate VXLAN overlay references and preserve full 64-bit wireless controller IDs.

### Changed

- Set the package version to 15.0.0 and update the Eliware test and common packages to v15.
- Use the Snowflake generator from `@eliware/common`.
- Group source modules and matching tests by responsibility.
- Use the canonical npm publishing workflow and fetch full Git history in CI.
- Load schemas from the published `specs/schema/` folder.
- Expand the CLI guide and end-user documentation.
- Align package metadata, repository directives, documentation, and workflows with Eliware conventions.

### Fixed

- Reject imprecise schema integers and invalid network address values.
- Validate route targets, gateway hosts, network membership, and segment address ranges.
- Find conflicting interface addresses and MAC addresses on each segment.
- Validate wireless network references and address conflicts.
- Use correct IPv6 address expansion and compression.
- Clarify inventory source age limits and report invalid command arguments consistently.
- Clarify that invalid `checkedOn` dates stop the freshness report during validation.

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
- Write end-user documentation in direct language.
- Split validator and schema code into focused modules with matching tests.
- Keep complete test coverage for the validator modules.

### Fixed

- Skip follow-on reference errors for records with schema errors.
- Normalize MAC addresses before NetDoc checks DHCP lease and reservation pairs.
- Check trunk PVID segments for untagged VLAN use.
- Reject CIDR prefixes in load balancer pool range endpoints.
- Find overlapping network ranges on each segment.
- Allow distinct host addresses inside the same subnet.
- Tighten checks for NAT values, IDs, interfaces, segments, and network values.

## 11.0.0 — 2026-10-09

### Added

- Add YAML schemas for physical machines, virtual machines, network devices, and network segments.
- Add schema rules for IDs, references, hardware, storage, and interfaces.
- Add network fields for routes, BGP, tunnels, firewall, NAT, address pools, DHCP, and Layer 2 announcements.
- Add fields for access mode, trunk mode, VLANs, PVIDs, and internal interfaces.
- Add a read-only `netdoc` command for help, version, YAML checks, and Snowflake IDs.
- Add `-n COUNT` to print multiple Snowflake IDs in one command.
- Check YAML syntax and object schemas before cross-file checks.
- Check positive signed 64-bit IDs and unique IDs across objects and interfaces.
- Check object, interface, machine-host, and network-peer references.
- Check reciprocal interface links and local interface names.
- Check interface membership, segment links, VLANs, tagged segments, and PVIDs.
- Check duplicate IP and MAC addresses on each network segment.
- Check interface addresses against segment networks. Check network prefixes and gateways.
- Report each error with its file and YAML path. Add an object ID and correction hint when known.
- Keep validation read-only. Do not connect to networks or write inventory files.
- Add user guidance and tests for the schemas and CLI.
