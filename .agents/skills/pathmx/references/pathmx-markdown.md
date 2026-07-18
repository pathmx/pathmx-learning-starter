# PathMX Markdown

PathMX starts with CommonMark and GFM. Keep each Source readable without the
Player.

## Sources

A Markdown file becomes a Source. The final filename hint defines its build
type:

| File | Common role |
| --- | --- |
| `index.path.md` | Root or hub |
| `topic.guide.md` | Guide |
| `exercise.lab.md` | Practice |
| `lesson.lesson.md` | Lesson |
| `widget.components.md` | Component definitions |
| `notes.md` | Plain document |

Frontmatter holds short Source data:

```md
---
type: lesson
status: active
tags: [sql, joins]
related:
  - ./join-practice.lab.md
---

# Joining Tables
```

Use `type` for authored domain meaning. It does not replace the filename hint.

## Blocks

Use a blank-line-isolated `---` to start a Block. Use `***` for a visible rule
inside a Block.

```md
# Variables

Variables name values.

---

<!--
type: checkpoint
id: predict-output
-->

## Predict the output

What will this program print?
```

Add comment topmatter only when a Block needs stable data. Use a stable `id`
when a Block will be linked, resumed, or used as evidence.

One Block should make one move: orient, explain, model, practice, reflect, or
decide. Split when the goal or activity changes.

## Beats

Beats are focusable items inside a Block. PathMX derives them at build time
from headings, paragraphs, list items, tables, media, display math, code, and
Literate Components.

Control common Beat density with `play.steps`:

```yaml
play:
  steps:
    tables: rows
    lists: items
    code: single
```

- `tables` accepts `rows` or `single`.
- `lists` accepts `items` or `flat`.
- `code` accepts `single` or `none`.

Block data overrides Source data for that Block.

## Links

Use relative Markdown links:

```md
[Next lab](./loops.lab.md)
![Flow diagram](./images/flow.svg)

[@styles]: ./lesson.css
```

They serve three roles:

1. Relative Source links form graph edges and are rewritten to built routes.
2. Relative asset links are tracked build inputs.
3. Implemented `@`-labeled links and definitions invoke directives.

Link to a stable Block with `#block-id`. Play focus uses
`?play=<BeatId>` and is separate from a heading fragment. Use `related:` for
non-prose Source relations. Wikilinks are optional and depend on local config.

Keep paths relative so graph-aware move and remove commands can update them.

## Root and index Sources

A root Source is a build entry for one graph. `paths/index.path.md` is a common
default, but local config may define other entries. Index files are ordinary
Sources used as roots or hubs; their lists and links make the graph readable.

## Review

- The filename states the Source role.
- Frontmatter is short.
- Each Block has one purpose.
- Important Blocks have stable IDs.
- Links and assets resolve from the current file.
- The Source remains clear as plain Markdown.
