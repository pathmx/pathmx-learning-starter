# PathMX Tooling and Verification

Prefer repository scripts and the pinned project dependency. Inspect the
installed version and command help before using a version-sensitive feature.

```sh
bunx pathmx --version
bunx pathmx <command> --help
```

Use repository scripts first and `bunx pathmx` otherwise so builds, routes, and
graph changes use the exact project dependency. Reserve the native `pathmx`
alias for setup and self-update work outside a project.

## Install and update

For a new machine with Bun installed, create or update the native aliases from
the latest published package:

```sh
bunx @fellowhumans/pathmx@latest self-update
```

When the native command already exists:

```sh
pathmx self-update
pathmx self-update --check
```

The repository's `pathmxCompatibility.baseline`, exact dependency, and lockfile
govern authoring. A newer native command does not make newer syntax valid in an
older project.

Create an official Starter and include current official skills:

```sh
pathmx init <project-path> --template <starter-repository>
```

Refresh managed official skills inside a recognizable PathMX Space:

```sh
pathmx init --skills
```

Skill refresh is an in-place, complete replacement of the managed skill tree.
Do not create or switch to a temporary Git branch for it. Preserve root
`AGENTS.md` and other project instructions; replace stale or bespoke files
inside the managed skill directories with the current official set.

Do not update an existing project's dependency or config merely to make new
syntax work. Use its lockfile unless the user asked for an upgrade.

## Safe version migration

For a new learning space, or when the learner asks to stay current, treat an
update as a small transaction:

1. Start from a verified local commit or back up `package.json` and the
   lockfile.
2. Update the project package with
   `bun add --exact @fellowhumans/pathmx@latest`.
3. Run the repository's candidate check when it has one; otherwise build every
   configured Path into scratch output and run its full check.
4. Smoke-test Player routes plus any questions, annotations, and components
   the repository uses.
5. After those checks pass, promote the exact installed dependency to the
   repository's compatibility baseline and rerun the normal check.
6. Keep and commit the update only when the normal check passes.
7. On failure, restore only the version files, reinstall the lockfile, and
   report the incompatibility. Do not rewrite learner responses to force a
   migration.

After a successful update, inspect release-specific help before adopting new
syntax. Existing Source data and the installed fixtures remain the contract.

## Commands

| Command | Purpose |
| --- | --- |
| `pathmx init` | Create config, materialize an official Starter, or update official skills. |
| `pathmx self-update` | Install or update native command aliases. |
| `pathmx build` | Build and exit. |
| `pathmx dev` | Build, serve, and watch. |
| `pathmx play` | Build, watch, serve, and open the Player. |
| `pathmx route` | Resolve a built Source path, id, or route. |
| `pathmx mv` | Move a Source and update links. |
| `pathmx rm` | Remove a Source and update links. |

## Scratch build

Never use a live `.pathmx` directory for a diagnostic build.

```sh
bunx pathmx build <entry-source> -o .pathmx-check --clean
```

A passing build has three results:

1. The command exits successfully.
2. The summary reports at least one built Path.
3. The expected Source appears in a generated `sources.json`.

A startup banner is not a completed build. Review warnings and wait for exit.

## Route lookup

Resolve the route from built metadata:

```sh
bunx pathmx route paths/example.lesson.md
bunx pathmx route paths/example.lesson.md --base-url http://127.0.0.1:3000
bunx pathmx route example.lesson --json
```

Use the full Source path whenever basenames repeat. A query such as
`index.path` can legitimately resolve the root instead of a nested Path; do not
use that result as a verified route for the nested Source.

Do not run a recursive text search across `.pathmx` to diagnose a route. Its
generated cache can be very large. Prefer `pathmx route --json`, then inspect
only `paths.json`, the relevant `serve-routes.json` or `sources.json`, or the
single target source map.

Add Block or Beat positioning only from built metadata or a verified Player
URL.

## Graph changes

Preview moves and removals when the installed command supports `--dry-run`:

```sh
bunx pathmx mv old.lesson.md new.lesson.md --dry-run
bunx pathmx rm unused.lesson.md --dry-run
```

Apply the command, inspect rewritten links, then rebuild the affected root.

## Handoff

Report changed Sources, the PathMX version, commands run, build result, and any
skipped Player checks. Lead with the verified Player route for learner-facing
work.
