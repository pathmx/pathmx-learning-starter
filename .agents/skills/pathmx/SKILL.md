---
name: pathmx
description: Author, revise, review, and verify PathMX sources. Use for Markdown, Sources, Blocks, Beats, links, directives, components, Play pacing, media, code, math, styling, configuration, and CLI work in a PathMX repository.
---

# PathMX

Create readable Markdown that builds and plays correctly with the repository's
installed PathMX version.

## Workflow

1. Read the nearest repository instructions.
2. Inspect local config, package scripts, PathMX version, entry Source, and
   nearby examples.
3. Identify the Source role and audience.
4. Draft ordinary Markdown first.
5. Use `---` Blocks and Beats only when they improve pacing or focus.
6. Reuse local links, directives, components, and styles. Do not invent syntax.
7. Build into scratch output and report the result.

Repository instructions and pinned versions override these examples.

## Terms

| Term | Meaning |
| --- | --- |
| Source | One Markdown file. |
| Block | One coherent unit separated by `---`. |
| Beat | One focusable item inside a Block. |
| Frontmatter | Source-level YAML at the top of a file. |
| Topmatter | Block data in an HTML comment after a divider. |
| Type hint | The filename suffix before `.md`, such as `.lesson.md`. |
| Root Source | An entry Source for one built graph. |
| Play | Guided traversal of Blocks and Beats. |
| Directive | An implemented `@`-labeled Markdown link or definition. |
| Literate Component | A custom tag defined in a component Markdown file. |

## References

Read only what the task needs:

- [Markdown authoring](./references/pathmx-markdown.md)
- [Player and pacing](./references/pathmx-player.md)
- [Directives](./references/pathmx-directives.md)
- [Literate Components](./references/pathmx-literate-components.md)
- [Code](./references/pathmx-code.md)
- [Math](./references/pathmx-math.md)
- [Media](./references/pathmx-media.md)
- [Styling](./references/pathmx-styling.md)
- [Configuration](./references/pathmx-config.md)
- [Tooling and verification](./references/pathmx-tooling.md)
- [Small repository example](./references/pathmx-repo-example/pathmx-repository.md)

## Boundaries

- Keep Sources useful as plain Markdown.
- Use relative Source and asset links.
- Use source-facing `type`, not a new `kind` field.
- Do not update PathMX or project config unless requested.
- Do not write diagnostic output into a live `.pathmx` directory.
- Do not author questions, actions, or spaceholders from this skill yet.
- If a feature is absent or version-mismatched, report the gap.
