# PathMX Configuration

Prefer `pathmx.config.md`. PathMX finds the nearest config while walking up
from the current directory. Do not keep both `pathmx.config.md` and
`pathmx.json` in one project.

## Example

```md
---
sourceDir: paths
outDir: .pathmx
plugins:
  tailwind: false
---

# PathMX

## Paths

- [Home](./paths/index.path.md)
- [Workshop](./paths/workshop.path.md)
```

Config settings live in frontmatter. Path entries are local Markdown links in
a `## Paths`, `## Path Entries`, or `## Build Paths` section. When `sourceDir`
is set, entry files must be inside it.

Use config for source roots, build output, plugins, site data, and development
options. Keep credentials out of config; name environment variables instead.

## Defaults

PathMX can build an explicit entry without config:

```sh
pathmx build paths/index.path.md
```

When local config defines entries, omit the entry only when you intend to build
those configured Paths.

Plugin keys and options are version-specific. Check the repository's installed
version and `pathmx <command> --help` before changing them.
