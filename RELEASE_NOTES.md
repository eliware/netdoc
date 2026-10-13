# Release Notes

## 12.0.0 — 2026-10-13

### Changed

- Eliware Test v12 checks the package, project files, and release workflow.
- The package uses v12 of `@eliware/test`, `@eliware/common`, and `@eliware/snowflake`.
- The npm package includes the specification files and object schemas.
- The CLI loads object schemas from `specs/schema/`.
- The user guide covers install, commands, validation checks, errors, and package limits.
- The Knit deployment path is `/eliware/netdoc`, with a five-minute timeout.
- Project guidance and release notes use clear, direct language.

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
