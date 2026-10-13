# NetDoc CLI Guide

Use this guide to install NetDoc, check inventory YAML, and print Snowflake IDs.

## Purpose and limits

NetDoc checks network and system inventory. It reads YAML files and reports errors. It does not change files or connect to devices.

NetDoc supports physical machines, virtual machines, network devices, and network segments. It does not track applications or services.

## Requirements

- Use Node.js 26 or later to run NetDoc.
- Use npm to install the package.
- Use a terminal with access to the npm registry for installation.
- Set no environment variables. NetDoc has no runtime settings.

## Install and check the command

Install the public package:

```sh
npm install --global @eliware/netdoc
```

List the commands:

```sh
netdoc --help
```

Print the installed package version:

```sh
netdoc --version
```

The npm package may not have the newest source version. An approved release publishes a version before npm can install it.

## Commands

| Command                         | Result                                            |
| ------------------------------- | ------------------------------------------------- |
| `netdoc --help`                 | Print command syntax and exit with code 0.        |
| `netdoc --version`              | Print the installed version and exit with code 0. |
| `netdoc validate <path>`        | Check one YAML file or a directory.               |
| `netdoc --generate-id`          | Print one Snowflake ID.                           |
| `netdoc --generate-id -n COUNT` | Print COUNT Snowflake IDs.                        |

Run one command at a time. Replace `<path>` with a YAML file or directory. Set `COUNT` to an integer from 1 through 1000.

### Check a file

Check one record:

```sh
netdoc validate inventory/network-devices/router.yaml
```

Use a path relative to the current directory or an absolute path. NetDoc checks files with `.yaml` or `.yml` extensions.

### Check a directory

Check every YAML file in a directory and its subdirectories:

```sh
netdoc validate inventory/
```

The directory must contain at least one YAML file. NetDoc checks each file as one YAML document. It rejects duplicate keys and extra documents.

### Print IDs

Print one ID:

```sh
netdoc --generate-id
```

Print three IDs:

```sh
netdoc --generate-id -n 3
```

NetDoc prints one integer on each line. It does not read inventory files or check for an ID that already exists.

## Inventory format

Store each object in one YAML file. Begin each record with these fields:

```yaml
version: "11.0"
kind: physical-machine
name: example-host
roles:
  - hypervisor
```

Use `version: "11.0"` for the current inventory schema. The CLI package version does not change this schema value.

### Object types

| Kind               | Required fields after `version`, `kind`, and `name` | Purpose                                                           |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------------- |
| `physical-machine` | `roles`                                             | Record a physical system and its stable hardware.                 |
| `virtual-machine`  | `residentOn`                                        | Record a VM and its host ID.                                      |
| `network-device`   | `roles`, `implementation`                           | Record a router, switch, firewall, access point, or network tool. |
| `network-segment`  | `id`, `medium`, `vlan`                              | Record an Ethernet, wireless, virtual, or tunnel segment.         |

Read the [schema index](../specs/schema/README.md) for all supported fields and limits.

### Machine fields

Physical and virtual machines can record roles, an SSH username, hardware, storage, and an operating system. Never store passwords or keys.

Hardware fields cover the maker, model, CPU, memory, and GPUs. Storage fields cover disks, RAID, partitions, file systems, mounts, and SMB or NFS shares.

Physical machines can also record a site, provider, region, data center, rack, rack unit, and provider asset ID. Virtual machines use `residentOn` for the host ID.

### Network device fields

Network devices can record roles, implementation type, firmware, software, hardware, location, and host IDs. Use `physical`, `software`, or `distributed` for implementation.

Network settings can record a default gateway, static routes, BGP peers and prefixes, VRRP, tunnels, Layer 2 announcements, firewall rules, NAT rules, load balancers, listeners, and DHCP scopes.

Switch settings can record managed or unmanaged switches. Use access ports for one segment. Use trunk ports for tagged segments and an optional PVID segment for untagged traffic.

### Network segment fields

Set `medium` to `ethernet`, `wireless`, `virtual`, `tunnel`, or `other`. Set `vlan` to an integer from 1 through 4094 or to `untagged`.

Use `ipNetworks` to list address ranges and optional gateways. NetDoc checks gateway addresses against the listed network prefix.

### Common fields

Every object needs `version`, `kind`, and `name`. Add `description`, `evidence`, or `notes` when they help explain stable facts.

Evidence can name a source, basis, date, and note. Set its basis to `configured`, `observed`, `reported`, or `inferred`.

### Storage fields

List storage devices under `storage.devices`. Record each device's model, media, capacity, RAID level, member devices, and partitions when known.

Use `storage.mounts` for mounted file systems. Use `storage.shares` for SMB or NFS shares. Record the share name, path, client list, and access mode when known.

### IDs and references

Use positive signed 64-bit integers for IDs. Write each ID as a YAML integer, without quotes. Add an object ID only when another record refers to it. A network segment needs an ID because interfaces refer to it.

Use an object's ID for fields such as `residentOn`, `segmentId`, `peerId`, and `connectsTo`. Give an interface an ID when another interface links to it. Set both `connectsTo` fields to the peer interface ID.

IDs must be unique across object and interface records. Every reference must resolve to an object or interface of the expected type.

### Interfaces and network segments

An interface needs a name and a type. It can record a MAC address, speed, MTU, parent interface, segment ID, addresses, and peer connection.

Use `ethernet`, `wireless`, `virtual-ethernet`, `tunnel`, `loopback`, `bridge`, `vlan`, or `other` for the interface type. Set an address assignment to `static`, `dhcp`, `dhcp-reservation`, or `virtual`.

Use a segment's `vlan` field for a VLAN number or `untagged`. Use an access port for one segment. Use a trunk port for tagged segments and an optional PVID segment.

Set an interface's segment ID to the matching segment record. Keep both peer interface links reciprocal. Give each interface name a unique value within its record.

Use `externalPeer` to name a peer outside the inventory. Use `unused: true` for an unused interface. Choose only one of `connectsTo`, `externalPeer`, and `unused`.

### Network settings

| Setting           | Record                                                          |
| ----------------- | --------------------------------------------------------------- |
| `routing`         | A default gateway, static routes, BGP, and VRRP.                |
| `tunnels`         | Tunnel type, interface, local address, port, and peer networks. |
| `l2Announcements` | Address, interface, and optional node ID.                       |
| `firewall`        | Default action, zones, and rules.                               |
| `nat`             | Source or destination rules and address translation.            |
| `loadBalancing`   | Address pools, listeners, targets, protocols, and ports.        |
| `listeners`       | Layer 4 address, protocol, and port details.                    |
| `dhcp`            | Network, address range, gateway, and reservations.              |

Set each BGP peer's address and remote AS number. Set the local AS number for the device. Use IDs for peers that have inventory records.

Set each firewall action to `allow`, `drop`, or `reject`. Use `any`, an address, or a network prefix for rule sources and destinations.

Set each NAT rule to `source` or `destination`. Set `translation` to `masquerade` or an IP address.

## Validation checks

NetDoc checks each input set in this order:

1. Parse one YAML document and reject duplicate keys.
2. Check the object type and its schema fields.
3. Check positive signed 64-bit IDs and global ID uniqueness.
4. Check object, interface, segment, and local interface references.
5. Check reciprocal interface links and switch port membership.
6. Check IP and MAC address conflicts on each network segment.
7. Check IP values, network prefixes, and segment gateways.

The schemas also check values such as VLAN numbers, port numbers, AS numbers, and address formats. NetDoc does not prove that a device or route works.

## Results and exit codes

On success, NetDoc prints the number of YAML files that passed. It exits with code `0`.

On an inventory error, NetDoc prints one error for each issue. Each error names the file and YAML path. It can include an object ID and a correction hint. NetDoc writes errors to standard error and exits with code `1`.

| Code | Meaning                                                  | Action                                      |
| ---- | -------------------------------------------------------- | ------------------------------------------- |
| `0`  | The command passed.                                      | Continue.                                   |
| `1`  | A YAML file failed a parse, schema, or cross-file check. | Correct the file and run the command again. |
| `2`  | The command, option, or input path is invalid.           | Check the command syntax and path.          |

An invalid directory or a directory without YAML files returns code `2`. A schema load error also returns code `2`.

## Troubleshooting

### NetDoc is not found

Check that the global npm command path is available. Install the package again if needed.

### NetDoc cannot find the input

Check the path from the current directory. Use a path to an existing YAML file or directory.

### NetDoc reports a schema error

Read the file, YAML path, and correction hint. Use a supported `kind` and schema version. Check every field against the schema index.

### NetDoc reports a duplicate ID or address

Find the earlier record named in the error. Give the object or interface a new ID. For an address error, use a free address on that segment.

## Package and release limits

The npm package contains the command, source modules, user guide, and schemas. It does not contain tests or repository workflows.

Use the package version that npm publishes. Source code can contain a newer version before a release. A tag alone does not approve a release. Follow Eliware Operations for release approval.

## More information

- Read the [NetDoc README](../README.md) for a short overview.
- Read the [release notes](../RELEASE_NOTES.md) for version changes.
- Read the [specification index](../specs/README.md) for repository rules and schema links.
