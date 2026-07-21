---
name: pathmx
description: Author, revise, review, play, and verify PathMX sources. Use automatically for PathMX Markdown, Sources, Blocks, Beats, links, directives, questions, annotations, Literate Components, Play pacing, Player routes, media, code, math, styling, configuration, CLI setup, builds, or browser review in any PathMX repository.
---

# PathMX

Create readable Markdown that builds correctly and feels coherent in the
PathMX Player.

## Work from the repository

1. Read the nearest repository instructions.
2. Inspect the local config, package scripts, installed PathMX version, entry
   Source, and nearby examples relevant to the task.
3. Identify the Source role and audience.
4. Draft ordinary Markdown first.
5. Add Blocks, Beats, directives, components, or custom styling only when they
   improve structure, focus, interaction, or comprehension.
6. Preserve relative links and reuse local conventions. Do not invent syntax.
7. Build into scratch output for diagnostics.
8. For playable or visual work, use the active Player and review the exact
   route in an available browser.
9. Report changed Sources, verification, and any skipped live review.

Repository instructions and installed versions override these examples.

## Keep the Player available

For learning and presentational work, detect a healthy Player that belongs to
the current repository. Reuse it or start the repository's long-lived Play
command. Do not stop an unknown listener.

Resolve Source routes with the repository's pinned CLI, normally
`bunx pathmx route`; do not guess from filenames. Use a stable Block fragment
or Play Beat position only after reading it from built metadata or the current
Player URL. Link to the narrowest useful position.

When Sources share a basename such as `index.path.md`, build the current graph
and query `pathmx route` with the full Source path. Never shorten an ambiguous
query or present the root Path result as the exact nested Source route.

Keep route diagnosis narrow. Do not recursively search or print `.pathmx`;
generated caches can flood the agent context and slow the learner's next turn.
Use `pathmx route --json` and, only when needed, inspect the target Path's
`paths.json`, `serve-routes.json`, `sources.json`, or one source map.

Use an integrated browser when it is available. In Codex, prefer `@Browser`.
In Claude Code, use its Chrome integration when already configured. Otherwise
open the system browser or give the user a clickable Player URL.

## Terms

| Term               | Meaning                                                 |
| ------------------ | ------------------------------------------------------- |
| Source             | One Markdown file.                                      |
| Block              | One coherent unit separated by `---`.                   |
| Beat               | One focusable item inside a Block.                      |
| Frontmatter        | Source-level YAML at the top of a file.                 |
| Topmatter          | Block data in an HTML comment after a divider.          |
| Type hint          | The filename suffix before `.md`, such as `.lesson.md`. |
| Root Source        | An entry Source for one built graph.                    |
| Play               | Guided traversal of Blocks and Beats.                   |
| Directive          | An implemented `@`-labeled Markdown link or definition. |
| Literate Component | A custom tag defined in a component Markdown file.      |
| Annotation         | A durable comment thread anchored in a Source.          |

## Route references

Read only what the task needs:

- [Markdown authoring](./references/pathmx-markdown.md)
- [Player, Play, and route handoff](./references/pathmx-player.md)
- [Directives](./references/pathmx-directives.md)
- [Questions and responses](./references/pathmx-questions.md)
- [Annotations](./references/pathmx-annotations.md)
- [Literate Components](./references/pathmx-literate-components.md)
- [Code](./references/pathmx-code.md)
- [Math](./references/pathmx-math.md)
- [Media](./references/pathmx-media.md)
- [Styling](./references/pathmx-styling.md)
- [Configuration](./references/pathmx-config.md)
- [Tooling, setup, and verification](./references/pathmx-tooling.md)
- [Small repository example](./references/pathmx-repo-example/pathmx-repository.md)

## Boundaries

- Keep Sources useful as plain Markdown.
- Use relative Source and asset links.
- Use source-facing `type`, not a new `kind` field.
- Treat learner responses and annotations as user-owned data.
- Do not update an existing project's dependency or config merely to make an
  example work. Follow its installed version and report a real gap.
- Do not write diagnostic output into a live `.pathmx` directory.
- Use only fixture-backed question mappings and component contracts.
- Do not author general actions or spaceholders from this skill yet.
- If a feature is absent or version-mismatched, state the boundary.
