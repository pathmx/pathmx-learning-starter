# PathMX Tooling and Verification

Prefer the repository's pinned command or package script. Check the version and
local config before using a recent feature.

```sh
pathmx --version
pathmx <command> --help
```

The public package provides `pathmx` and `pmx`:

```sh
bun add -g @fellowhumans/pathmx@latest
bunx @fellowhumans/pathmx@latest --version
```

Do not install or update PathMX unless the task requests it.

## Commands

| Command | Purpose |
| --- | --- |
| `pathmx init` | Create or migrate config. |
| `pathmx build` | Build and exit. |
| `pathmx dev` | Build, serve, and watch. |
| `pathmx play` | Run the Player authoring loop. |
| `pathmx mv` | Move a Source and update links. |
| `pathmx rm` | Remove a Source and update links. |

## Scratch build

Never use a live `.pathmx` directory for a diagnostic build.

```sh
pathmx build <entry-source> -o .pathmx-check --clean
```

A passing build has three results:

1. The command exits successfully.
2. The summary reports at least one built Path.
3. The expected Source appears in a generated `sources.json`.

Review warnings. A startup banner alone is not a completed build.

## Graph changes

Preview moves and removals when the installed CLI supports `--dry-run`:

```sh
pathmx mv old.lesson.md new.lesson.md --dry-run
pathmx rm unused.lesson.md --dry-run
```

Apply the command, inspect rewritten links, then rebuild the affected root.

## Handoff

Report the changed Sources, PathMX version, commands run, build result, and any
skipped Player checks. Include a Player route only when visual or interactive
behavior was reviewed.
