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
bunx pathmx build paths/index.path.md
```

When local config defines entries, omit the entry only when you intend to build
those configured Paths.

Plugin keys and options are version-specific. Check the repository's installed
version and `pathmx <command> --help` before changing them.

## Multiple Player roots

Most projects need one configured root whose links discover the rest of its
Source graph. Do not register every nested hub or lesson as another Path entry.

When a project intentionally configures multiple Player roots, every
non-default root needs a unique authored Source handle in its frontmatter. A
handle starts with `@` and then uses letters, numbers, dots, underscores, or
hyphens:

```md
---
handle: "@workshop"
---

# Workshop
```

Do not invent `handle` values from file paths. The checked fixture uses
`@workshop`; values such as `workshop` or `nested/index.path` are invalid.
