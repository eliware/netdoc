# Release Notes

## 11.0.0 — 2026-10-09

### Added

- Add YAML schemas for physical machines, virtual machines, network devices, and network segments.
- Add shared schema rules for BIGINT IDs, references, hardware, storage, and interfaces.
- Add network schemas for routing, BGP, tunnels, firewall, NAT, load balancing, DHCP, and Layer 2 announcements.
- Add switch models for access and trunk ports, VLAN segments, tagged traffic, PVIDs, and internal ports.
- Add a read-only `netdoc` command with help, version, inventory validation, and Snowflake ID generation.
- Add `-n COUNT` to generate multiple Snowflake IDs in one command.
- Validate YAML syntax and object schemas before cross-file checks.
- Check exact BIGINT range and global uniqueness for object and interface IDs.
- Check object references, interface references, VM host references, and peer references.
- Check reciprocal interface connections and local interface names.
- Check switch port segments, VLAN membership, tagged segments, and PVID conflicts.
- Check duplicate IP and MAC assignments on each network segment.
- Check interface address prefixes against their segment networks. Validate network address fields.
- Report each error with its file, YAML path, object ID when available, and a correction hint.
- Keep validation read-only. Open no network connections and write no inventory files.
- Add user guidance and automated tests for the schemas and CLI.
