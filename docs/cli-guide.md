# NetDoc CLI Guide

Use this guide to install NetDoc, check inventory YAML, and print Snowflake IDs.

## Purpose and limits

NetDoc checks network and system inventory. It reads YAML files and reports errors. It does not change files or connect to devices.

NetDoc supports physical machines, virtual machines, network devices, network segments, and wireless networks.

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

### Install in an inventory project

Add NetDoc as a development dependency when inventory is part of an npm project:

```sh
npm install --save-dev @eliware/netdoc
```

Run NetDoc through npm:

```sh
npx netdoc validate inventory/
npx netdoc --generate-id -n 3
```

You can also add project scripts that call `netdoc validate inventory/` and `netdoc --generate-id`.
Run those scripts with `npm run` and their script names.

## Commands

| Command                                                | Result                                            |
| ------------------------------------------------------ | ------------------------------------------------- |
| `netdoc --help`                                        | Print command syntax and exit with code 0.        |
| `netdoc --version`                                     | Print the installed version and exit with code 0. |
| `netdoc validate <path>`                               | Check one YAML file or a directory.               |
| `netdoc validate <path> --format json`                 | Print validation results as JSON.                 |
| `netdoc report <path> --freshness --max-age-days DAYS` | Report record dates.                              |
| `netdoc graph <path> --format mermaid`                 | Print inventory topology as Mermaid.              |
| `netdoc --generate-id`                                 | Print one Snowflake ID.                           |
| `netdoc --generate-id -n COUNT`                        | Print COUNT Snowflake IDs.                        |

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

The directory must contain at least one YAML file. NetDoc checks each file as one YAML document. It rejects duplicate keys and files with multiple YAML documents.

### Print validation results as JSON

Use JSON when a client must read validation results:

```sh
netdoc validate inventory/ --format json
```

The command prints one JSON document to standard output. It includes `status`, file and error counts, and a `diagnostics` array. Each diagnostic includes a stable code, file path, YAML path, and message. A diagnostic can also include a correction hint. The command does not include inventory content or secrets.

The `status` value is `passed` when validation succeeds. It is `failed` when inventory data has errors.
It is `error` when NetDoc cannot run the command, such as when the input path is missing.

The command uses the same exit codes as text output. Code `0` means validation passed.
Code `1` means inventory errors exist. Code `2` means the command or input is invalid.
Code `2` also means NetDoc cannot load its schemas.

Use `text` or omit `--format` to print the default text report. Use only `text` or `json` as the format value. Put the format option after the input path.

### Report record freshness

Report the age of recorded facts with a maximum age in days:

```sh
netdoc report inventory/ --freshness --max-age-days 180
```

The report uses dates from `evidence.checkedOn`. It checks the inventory against the schemas and references.
Then, it lists each object with its record status, source, date, and age in days.
The report does not change inventory files or connect to systems.

The command uses the current UTC date. It counts calendar days in UTC.
Each recorded date has one of these statuses:

- `no-evidence` means the object has no source entries.
- `undated` means a source entry has no `checkedOn` date.
- `current` means the UTC age is less than or equal to the selected maximum age.
- `stale` means the UTC age is greater than the selected maximum age.
- `future` means the date is after the current UTC date.

The report validates the inventory before it checks dates. An invalid `checkedOn` value stops the report and returns validation errors.
A missing or expired date does not fail inventory validation.
Set `DAYS` to a positive safe integer.
Set a limit that matches your inventory inspection period.

### Export topology as Mermaid

Print a Mermaid flowchart from the inventory:

```sh
netdoc graph inventory/ --format mermaid
```

The command validates the inventory before it prints a graph. It shows objects, interfaces, network segments, reciprocal interface links, and routing relationships.
It labels known values and identifies unknown endpoints. It shows configured inventory only.
It does not find live devices or test connectivity.

The command writes Mermaid text to standard output. Redirect the output when you want to save a diagram:

```sh
netdoc graph inventory/ --format mermaid > topology.mmd
```

The command accepts only the `mermaid` format. If validation fails, NetDoc prints diagnostics to standard error.
It does not print an incomplete graph or change inventory files.

### Print IDs

Print one ID:

```sh
netdoc --generate-id
```

Print three IDs:

```sh
netdoc --generate-id -n 3
```

NetDoc prints one integer on each line. It does not read inventory files or check if an ID is in use.
NetDoc gets the shared `snowflake` generator from `@eliware/common`.

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

### Suggested workflow

1. Create one YAML file for each object.
2. Use a separate folder for each object type when that layout helps your team.
3. Add an ID only when a different object or interface must refer to the record.
4. Use confirmed values. Keep temporary state and credentials out of inventory.
5. Run `netdoc validate inventory/` from the inventory project root.
6. Correct each reported file and YAML path, then run the command again.
7. Examine the YAML changes and commit them with your inventory project.

NetDoc reads the target file or directory. It does not write inventory files or change settings.

### Object types

| Type               | Required fields after `version`, `kind`, and `name` | Purpose                                                                   |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------------------- |
| `physical-machine` | `roles`                                             | Record a physical system and its stable hardware.                         |
| `virtual-machine`  | `residentOn`                                        | Record a VM and its host ID.                                              |
| `network-device`   | `roles`, `implementation`                           | Record a router, Layer 2 device, firewall, access point, or network tool. |
| `network-segment`  | `id`, `medium`, `vlan`                              | Record an Ethernet, wireless, virtual, or tunnel segment.                 |
| `wireless-network` | `id`, `ssid`                                        | Record an SSID and its protection mode.                                   |

Read the [schema index](../specs/schema/README.md) for all supported fields and limits.

### Machine fields

Physical and virtual machines can record roles, an SSH username, hardware, storage, and an operating system. Do not store passwords or keys.

Hardware fields cover the maker, model, CPU, memory, and GPUs. Storage fields cover disks, RAID, partitions, file systems, mounts, and SMB or NFS shares.

Physical machines can also record a site, provider, region, data center, rack, rack unit, and provider asset ID. Virtual machines use `residentOn` for the host ID.

### Network device fields

Network devices can record roles, implementation type, firmware, software, hardware, location, and host IDs. Use `physical`, `software`, or `distributed` for implementation.

Network settings can record a default gateway, static routes, BGP peers and prefixes, VRRP, tunnels, and Layer 2 announcements.

Network settings can also record firewall rules, NAT rules, load balancers, listeners, and DHCP scopes.

Layer 2 settings can record managed or unmanaged operation. Use access mode for one segment. Use trunk mode for tagged segments and an optional PVID segment for untagged traffic.

### Network segment fields

Set `medium` to `ethernet`, `wireless`, `virtual`, `tunnel`, or `other`. Set `vlan` to an integer from 1 through 4094 or to `untagged`.

Use a host address inside each listed network for its gateway. For IPv4 prefixes shorter than `/31`, NetDoc rejects the first and last addresses.

### Common fields

Every object needs `version`, `kind`, and `name`. Add `description`, `evidence`, or `notes` to state stable facts.

You can omit `evidence`. Each `evidence` entry needs a source and a basis. Add `checkedOn` when you know the date.
Set the basis to `configured`, `observed`, `reported`, or `inferred`.

### Storage fields

List storage devices under `storage.devices`. Record each device's model, media, capacity, RAID level, member devices, and partitions when known.

Use `storage.mounts` for mounted file systems. Use `storage.shares` for SMB or NFS shares. Record the share name, path, client list, and access mode when known.

### IDs and references

Use positive signed 64-bit integers for IDs. Write each ID as a YAML integer, without quotes. Add an object ID only when a different record refers to it. A network segment needs an ID because interfaces refer to it.

Use an object's ID for fields such as `residentOn`, `segmentId`, `peerId`, and `connectsTo`. Give an interface an ID when a different interface links to it. Set both `connectsTo` fields to the peer interface ID.

IDs must be unique across object and interface records. Every reference must resolve to an object or interface of the expected type.

### Interfaces and network segments

An interface needs a name and a type. It can record a MAC address, speed, MTU, parent interface, segment ID, addresses, and peer connection.

Set `mtu` to a confirmed configured maximum packet length in bytes. NetDoc accepts positive integers from 1 through 4,294,967,295 on every supported interface type. NetDoc does not infer a default or check device support.

Add an entry to the object's `evidence` list. Set `basis: configured` and name the configuration source. In the entry's `note`, identify the interface and MTU. Do not use `mtu` for a live value. The schema has no separate field for an observed MTU.

Use the same MTU on hosts in one subnet. Check every path when traffic crosses a tunnel. Set each tunnel MTU to the underlying path limit minus tunnel-header bytes. OVHcloud's vRack jumbo-frame guide requires the same MTU on hosts in a subnet. The guide warns that some server products may limit jumbo-frame support. Some OVHcloud servers or vRack paths may not support MTU 9000.

```yaml
version: "11.0"
kind: physical-machine
name: Example server
evidence:
  - source: Network interface configuration
    basis: configured
    note: eth0 is configured with an MTU of 1500 bytes.
interfaces:
  - name: eth0
    type: ethernet
    mtu: 1500
```

Read the [OVHcloud vRack jumbo-frame guide](https://docs.ovhcloud.com/en/guides/bare-metal-cloud/dedicated-servers/vrack-mtu-jumbo-frames) before you use jumbo frames on vRack.

Use `ethernet`, `wireless`, `virtual-ethernet`, `tunnel`, `loopback`, `bridge`, `vlan`, or `other` for the interface type. Set an address assignment to `static`, `dhcp`, `dhcp-reservation`, or `virtual`.

Use a segment's `vlan` field for a VLAN number or `untagged`. Use access mode for one segment. Use trunk mode for tagged segments and an optional PVID segment.

Set an interface's segment ID to the matching segment record. Keep both peer interface links reciprocal. Give each interface name a unique value in its record.

Use `externalPeer` to name a peer outside the inventory. For an interface with no peer, set `unused: true`. Select only one of `connectsTo`, `externalPeer`, and `unused`.

### Wireless networks

Create one `wireless-network` record for each SSID. Give it a unique object ID and a concise inventory name.
Set `security.mode` to `open`, `wpa2-personal`, `wpa3-personal`, `wpa2-enterprise`, `wpa3-enterprise`, or `unknown` when known.
Do not store passwords, pre-shared keys, certificates, or other secrets.

```yaml
version: "11.0"
kind: wireless-network
id: 9001
name: Indoor 5 GHz Wi-Fi
ssid: private5
security:
  mode: unknown
```

Use one `wireless` interface with `role: radio` for each access point radio.
List each SSID in `wireless.broadcasts`. Set its `wirelessNetworkId` and `segmentId` fields.
Add `bssid` and `hidden` when those facts are known. Add `band`, `channel`, and `channelWidth` when known.

```yaml
interfaces:
  - name: 5 GHz radio
    type: wireless
    wireless:
      role: radio
      band: 5 GHz
      broadcasts:
        - wirelessNetworkId: 9001
          segmentId: 9002
```

Use `role: client` for a machine wireless interface. List configured SSIDs in `wireless.profiles` by wireless-network ID.
Set `autoJoin` and `priority` when known. Set `accessPointId` only when the client must use one access point.
Do not use a profile to record the client's current access point.

Every radio must use `broadcasts`. Every client must use `profiles`.

Keep `segmentId` on a client when its profiles use one fixed segment. Omit it when the profiles use different segments.

```yaml
interfaces:
  - name: Wi-Fi
    type: wireless
    wireless:
      role: client
      profiles:
        - wirelessNetworkId: 9001
        - wirelessNetworkId: 9003
```

Set `wirelessManagement.state` to `managed`, `unmanaged`, or `unknown` for an access point.
Set `controllerId` only when the access point has a confirmed wireless controller.
The controller must have the `wireless-controller` role. A controller record alone does not prove that it manages an access point.

### DNS name associations

List complete DNS names that include the host and domain, such as `nas.example.net`, in an address entry's `dnsNames` field.
Use ASCII letters, digits, and hyphens in each name label. Use a final label with 2 through 63 letters. Do not add a final dot.

Use this field only to associate names with an inventory address. Do not use it to configure DNS.
Keep DNS zones, record types, TTL values, resolver settings, and PTR records out of NetDoc.
VyOS remains the source for authoritative DNS configuration.

```yaml
addresses:
  - cidr: 192.0.2.10/24
    assignment: dhcp-reservation
    dnsNames:
      - nas.example.net
      - nas-sql.example.net
```

### Network settings

| Area              | Record                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `routing`         | A default gateway, static routes, BGP, and VRRP.                                            |
| `tunnels`         | Tunnel type, interface, local address, `listenPort`, and peer networks with `endpointPort`. |
| `l2Announcements` | Address, interface, and optional node ID.                                                   |
| `firewall`        | Default action, zones, and rules.                                                           |
| `nat`             | Source or destination rules and address translation.                                        |
| `loadBalancing`   | Address pools, listeners, targets, protocols, and `port` numbers.                           |
| `listeners`       | Layer 4 address, protocol, and `port` details.                                              |
| `dhcp`            | Network, address range, gateway, and reservations.                                          |

Set each BGP peer's address and remote AS number. Set the local AS number for the device. Use IDs for peers that have inventory records.

Set each firewall action to `allow`, `drop`, or `reject`. Use `any`, an address, or a network prefix for rule sources and destinations.

Set each NAT rule to `source` or `destination`. Use an IP address for source and destination NAT. Use `masquerade` only for source NAT.

## Validation checks

NetDoc checks each input set in this order:

1. Parse one YAML document and reject duplicate keys.
2. Check the object type and its schema fields.
3. Check positive signed 64-bit IDs and global ID uniqueness.
4. Check object, interface, segment, and local interface references.
5. Check reciprocal interface links and local interface membership.
6. Check wireless-network, wireless-controller, access-point, and segment references.
7. Check unique wireless profiles, radio broadcasts, and DNS names.
8. Check IP and MAC address conflicts on each network segment. NetDoc permits a DHCP lease and reservation to share an address when their MAC addresses match.
9. Check IP values, network prefixes, and segment gateways.

The schemas also check VLAN numbers, `port` numbers, AS numbers, and address formats. NetDoc cannot prove that a device or route works.

## Results and exit codes

On success, NetDoc prints the number of YAML files that passed. It exits with code `0`.

On an inventory error, NetDoc prints one error for each issue. Each error names the file and YAML path. It can include an object ID and a correction hint. NetDoc writes text errors to standard error and exits with code `1`. JSON validation prints its result document to standard output and uses the same exit code.

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

Find the earlier record named in the error. Give the object or interface a new ID. For an address error, use an available address on that segment.

## Package and release limits

The npm package contains the command, source modules, user guide, and schemas. It does not contain tests or repository workflows.

Use the package version that npm publishes. Source code can contain a newer version before a release. A tag alone does not authorize a release. Follow Eliware Operations for release approval.

## More information

- Read the [NetDoc README](../README.md) for a short overview.
- Read the [release notes](../RELEASE_NOTES.md) for version changes.
- Read the [specification index](../specs/README.md) for repository rules and schema links.
