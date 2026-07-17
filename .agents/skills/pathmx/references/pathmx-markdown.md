# PathMX Markdown

PathMX supports full CommonMark and GFM out-of-the box. It also supports several unique extensions that should be used where appropriate.

The overall goal when creating PathMX markdown is that it should serve as a human and agent readable canonical source for the topic being covered. It should render in most markdown tools like Obsidian or in browse mode on GitHub, with more advanced/interactive interactions authored using html/css and PathMX "literate components" (see below).

## Key PathMX Concepts

PathMX parses and builds markdown source files into a `Source > Blocks > Beats` structure that is used by the [PathMX player](./pathmx-player.md) to guide the user through a learning experience in an interactive and focused way.

---

### Sources

A PathMX source is a markdown file with a type hint (either a type-hinted file name or frontmatter-specified type). A PathMX source automatically processes metadata, hash and other data and builds its content into blocks.

---

### Blocks

A **Block** is a thematic unit of content — like a slide, or a one-sheet tutorial. Every Source has at least one Block. Additional Blocks are created with the `---` thematic break. Blocks are the coarse Play unit; [Beats](#beats) are the fine-grained stops inside a Block. Together they make an instructional document playable in a focused way in the [pathmx player](./pathmx-player.md).

#### Syntax

- Split Blocks with a lone `---` on its own line, **with blank lines above and below**. A `---` that is not blank-line-isolated is not a Block boundary.
- Do not confuse **source frontmatter** (a YAML fence at the top of the file) with **block topmatter** (optional YAML-ish keys at the start of a Block, before its body).
- Give Blocks you may link to or resume a stable `id:` in topmatter. Otherwise PathMX will use a default ordinal-based identity.

```md
id: photosynthesis-inputs
title: What goes in

# Inputs

Plants need three inputs.

- Light
- Water
- CO₂

---

id: photosynthesis-equation
title: The equation

# Equation

$$6CO_2 + 6H_2O \rightarrow C_6H_{12}O_6 + 6O_2$$
```

Block topmatter may also carry local `play:` overrides (density, table steps). Block data wins over source frontmatter for that Block. See [Beats](#beats) for `play.steps`.

#### Authoring for Play (LX)

- One Block ≈ one slide-sized idea / one completable win.
- Prefer a clear heading plus a handful of Beats over a long essay that becomes a tall scroll. That said, longer content may be necessary for more long-form work.
- **Split** when the idea or topic changes, the practice loop changes, the modality changes (prose → code → quiz), or the content would honestly be two slides.
- **Keep together** when setup and punchline need one establishing shot or a complete work needs to be focused on and finished.
- Rough Beat budget: a few step Beats per Block (paragraphs, list items, media, one table or fence) — not dozens. Mega-lists and multi-table Blocks explode the Play route; split the Block or opt density down with `play.steps`.
- Headings are browse stops, not structure. Use `---` to structure Play; do not spam headings to fake Block boundaries.

#### Anti-patterns

- A single Block that is a wall of prose (one giant paragraph Beat, or endless paragraphs).
- Several unrelated tables or code fences crammed into one Block.
- Deep nested lists for everything when default `lists: items` will step every bullet.
- Putting “next lesson” navigation prose where a path link / graph edge belongs.
- Relying on `#fragment` alone for Play position — Play focus is owned by `?play=<BeatId>` (see [Beats](#beats)).

Density, fence steps, table steps, and addressable Beat ids are covered under Beats. Literate component states belong in [Literate Components](./pathmx-literate-components.md).

---

### Beats

A **Beat** is one focusable Play stop inside a **Block** — like a step on a slide, a bullet in a list, or a paragraph in a document. PathMX’s build choreographer annotates rendered HTML; the Player only reads those annotations (`data-pathmx-beat*`). It never invents beats from bare DOM.

PathMX automatically choreographs normal markdown into the following beats:

- **Headings** (`#` … `######`) — browse-level stops (not Play “step” focus)
- **Paragraphs** — each non-empty prose paragraph
- **List items** — each `li`; an item with a nested list is a **container**, and nested items are child beats
- **Tables** — the table, then each body row (header/`tfoot` rows are never beats)
- **Media** — `figure` and bare `img` / `video` / `audio` (an image inside a figure is not a separate beat)
- **Display math** (`$$…$$`) — one beat per display expression (inline `$…$` stays part of the surrounding prose beat)
- **Code fences** — one beat per fence by default; authored line steps via fence info become child `code-step` beats
- **Literate components** — each instance is a beat; nested instances nest as containers; ordered `states="a | b"` add virtual step beats on the same host

Nesting: steps are not annotated inside an existing beat except nested list items, table body rows under a table container, and nested literate components. Containers are marked `data-pathmx-beat-container="true"`. Flat Play order follows document order (containers before their children).

Density can be opted down with `play.steps` frontmatter (block topmatter overrides source):

```yaml
play:
  steps:
    tables: rows   # default; or `single` for one beat per table
    lists: items   # default; or `flat` to collapse nested lists
    code: single   # default; or `none` to omit fences from the route
```

Special authoring:

- Pre-existing `data-pathmx-beat` markers are preserved and not overwritten
- Block `play.table.steps` can replace automatic row beats with labeled region steps (requires exactly one table in the block)
- Code fence info like `` ```lang [1-2|3|4] `` `` authors ordered `code-step` children (`|` = then, `,` = together, `N-M` = range)
- `@include` projects target beats into the host Block under placement-scoped ids
- Footnotes, hidden content, closed `<details>` / foldable callout bodies, empty paragraphs, and headings inside components are excluded

Addressing: beat ids look like `{blockId}:heading-0`, `{blockId}:step-0`, `{blockId}:code-0`, `{parentId}:step-1`. In Play, focus is owned by the URL via `?play=<BeatId>` (`?play` / `?play=1` enters at the normal entry beat). Heading `#fragment` is separate browse/scroll targeting.


### Links

<!-- TODO: draft. Linking is how PathMX builds and interprets the graph. All of
     it is standard markdown link syntax — PathMX assigns meaning by position
     and label:

     1. Inline links = graph edges. A relative link to another source
        (`[Next lab](./loops.lab.md)`) creates a navigable edge; PathMX
        rewrites known source links to routes. A link plus trailing prose in a
        list = an annotated edge (the hub/path pattern in *.path.md files).
     2. Image/asset links = build dependencies. Relative asset paths are
        tracked and copied into the build.
     3. Reference DEFINITION links with an `@` label = directives/imports:
        `[@styles]: ./x.css`, `[@widgets]: ./w.components.md`,
        `[@include.note]: ./shared.md#note`. Same markdown syntax, different
        role — see pathmx-directives.md for each directive.

     Also cover: targeting a Block with `#block-id` vs a Beat with
     `?play=<BeatId>`; `related:` frontmatter as non-prose edges; wikilinks
     `[[Target]]` as an opt-in alternative; keep links relative so graph-aware
     tools (`pathmx mv`) can rewrite them. -->

### Root Sources

A root Source is an entry point to the PathMX repository. PathMX defaults to `paths/index.path.md` as the entry point but other roots can be specified via the CLI or configured in [PathMX config](./pathmx-config.md).


### Index Files


---

# Specific Extensions/Plugins

- [Literate Components](./pathmx-literate-components.md)
- [Directives (includes, imports, resources)](./pathmx-directives.md)
- [Questions & Responses](./pathmx-questions.md)
- [Math](./pathmx-math.md)
- [Media & Images](./pathmx-media.md)
- [Code](./pathmx-code.md)
- [Styling & Theming](./pathmx-styling.md)

For the guided player UX and pacing, see the [PathMX Player](./pathmx-player.md) guide. For CLI usage and build verification, see [Tooling & Verification](./pathmx-tooling.md).
