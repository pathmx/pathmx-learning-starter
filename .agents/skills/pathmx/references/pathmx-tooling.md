# PathMX Tooling & Verification

Use the PathMX CLI to initialize a repository, build content, run the live authoring server, and open the Player. Verify every authored change with a clean scratch build before considering it complete.

## Quick workflow

```sh
pathmx --version
pathmx build <entry-source> -o .pathmx-check --clean
pathmx play <entry-source>
```

Use `.pathmx-check` only as disposable verification output. Do not replace or inspect the live `.pathmx` directory while a development server is using it.

---

## CLI commands

| Command | Purpose |
| --- | --- |
| `pathmx init` | Create or migrate `pathmx.config.md` |
| `pathmx build` | Build one or more PathMX paths and exit |
| `pathmx dev` | Build, serve, watch, and reload authored paths |
| `pathmx play` | Build, serve, watch, and load the Player shell |
| `pathmx mv` | Move linked Markdown and rewrite graph references |
| `pathmx rm` | Remove linked Markdown and unlink graph references |

Run `pathmx <command> --help` before using an unfamiliar option. The examples in this guide were verified with PathMX 0.1.13.

### Initialize a repository

```sh
pathmx init
```

Use `--force` only when intentionally replacing an existing PathMX configuration. After initialization, inspect `pathmx.config.md` before building.

### Build once

```sh
pathmx build paths/index.path.md
```

`build` writes artifacts and exits. Pass an explicit entry source when the repository has no configured or conventional default entry.

### Develop with live updates

```sh
pathmx dev paths/index.path.md --port 3000
```

`dev` watches the repository, incrementally rebuilds changed content, and sends refreshes to attached pages. Keep the process running while authoring and stop it with `Ctrl-C`.

### Open the Player

```sh
pathmx play paths/index.path.md --port 3000 --open
```

`play` runs the same watch/build loop and includes the Player shell. Use `--print-url` instead of `--open` when another tool or browser will open the URL.

---

## Verifying a change

Build into a separate scratch directory, never the live `.pathmx` directory:

```sh
pathmx build <entry-source> -o .pathmx-check --clean
```

`--clean` clears the scratch build cache first. A successful verification requires all of the following:

1. The command exits with status `0`.
2. The output reports at least one built Path.
3. The scratch directory contains `paths.json`.
4. The expected source appears in that Path's `sources.json`.
5. Every warning and error has been reviewed.

Check the manifests without assuming a fixed Path output directory:

```sh
test -f .pathmx-check/paths.json
find .pathmx-check -name sources.json -print
rg '"path": "paths/index.path.md"' .pathmx-check
```

Replace `paths/index.path.md` with the source being verified. A zero exit status is not enough if the wrong entry was built or warnings reveal invalid authored behavior.

### Treat warnings as verification results

Read the complete build output. Fix warnings such as:

- `choreographer/table-steps-invalid` — authored table steps do not match the table.
- `icons-lucide/unknown-icon` — the requested icon name is unavailable.
- Missing source assets — a linked local file was not copied because it could not be found.
- Code-step warnings — a line-step spec is malformed or points past the fence.

Rebuild after every fix until the output is understood and acceptable.

---

id: verified-tooling-example
title: Verified scratch build

# Verified scratch build

This repository can verify this reference with a real PathMX build:

```sh
pathmx build skills/pathmx/references/pathmx-tooling.md \
  -o /tmp/pathmx-tooling-check \
  --clean
```

Successful output from this checkout (repository path shortened):

```text no-copy
Built 1 path from …/pathmx-skills to ../../../../../tmp/pathmx-tooling-check.
Artifacts: 15 written, 0 deleted.
```

The generated manifest must identify this source:

```json no-copy
{
  "entrySourceId": "skills/pathmx/references/pathmx-tooling",
  "path": "skills/pathmx/references/pathmx-tooling.md"
}
```

This Block is also rendered through `pathmx play`, proving that the verified source is playable as well as buildable.

---

## Verifying live behavior

After the scratch build passes, run the entry with `pathmx play`:

```sh
pathmx play <entry-source> --print-url
```

Verify in the browser that:

- The intended source opens.
- Player mode activates with `?play`.
- Blocks and Beats appear in the expected order.
- Interactive controls work.
- Editing the source triggers an incremental rebuild and refresh.
- The browser console has no relevant errors.

A build proves compilation. A Player check proves the learner-facing result.

---

## Graph-aware file operations

Use PathMX commands for linked Markdown instead of raw `git mv` or file deletion. PathMX updates graph backlinks, relative links, and `related:` references.

Preview a move before applying it:

```sh
pathmx mv paths/old.lesson.md paths/new.lesson.md --dry-run
```

Then apply and verify:

```sh
pathmx mv paths/old.lesson.md paths/new.lesson.md
pathmx build paths/index.path.md -o .pathmx-check --clean
git diff --check
```

Preview a removal before applying it:

```sh
pathmx rm paths/unused.lesson.md --dry-run
```

Then apply only after confirming the reported unlink operations:

```sh
pathmx rm paths/unused.lesson.md
pathmx build paths/index.path.md -o .pathmx-check --clean
git diff --check
```

Always inspect `git diff` after a graph-aware operation. The rewritten backlinks are part of the change and must be reviewed.

---

## Verification checklist

- Confirm the installed PathMX version.
- Use the correct entry source.
- Build with `--clean` into a scratch output directory.
- Confirm at least one Path was built.
- Confirm the expected source exists in `sources.json`.
- Review all warnings and errors.
- Open the source with `pathmx play`.
- Check Player navigation and interactive behavior.
- Use `pathmx mv` and `pathmx rm` for graph-aware changes.
- Review the final Git diff.
