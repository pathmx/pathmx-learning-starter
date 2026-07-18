# PathMX Player and Play

The build fixes the Play route. The Player reads built Block and Beat data; it
does not invent structure from the browser DOM.

## Model

| Level | Use |
| --- | --- |
| Block | Coarse stop created by `---`. |
| Browse heading | Free-scroll map stop. |
| Step | Fine Beat such as a paragraph, list item, row, code step, or component state. |

Forward and backward move through the route. Skip-out moves up one nesting
level. Active and seen state are projected onto the rendered content. The URL
owns Play position through `?play=<BeatId>`; `#fragment` remains a browse
target.

## Pacing controls

Authors control pacing with:

- Block boundaries;
- `play.steps` density for lists, tables, and code;
- code focus steps such as `[1-2|3]`;
- Block-local table focus steps; and
- ordered Literate Component states.

Use [Markdown authoring](./pathmx-markdown.md) for Blocks and density,
[Code](./pathmx-code.md) for fence steps, and
[Literate Components](./pathmx-literate-components.md) for state.

## Table steps

For one table in a Block, add a small ordered sequence:

```md
---

<!--
id: compare-cases
play:
  table:
    steps:
      - label: Compare inputs
        rows: 1-2
        columns: 1-3
      - label: Inspect output
        columns: 4
-->

## Compare cases

| Case | A | B | Output |
| --- | --- | --- | --- |
| One | 2 | 3 | 5 |
| Two | 4 | 5 | 9 |
```

Rows and columns are one-based. A step needs `rows`, `columns`, or both. Build
warnings fall back to ordinary row Beats.

## Interactive Beats

Play and direct interaction share a Literate Component's ordered state. The
component must also work outside Play. Use component state for presentation,
not durable learner evidence.

## Authoring review

- Make each Block one coherent move.
- Keep meaningful stages addressable.
- Avoid long Blocks with dozens of Beats.
- Do not hide essential steps in an opaque component loop.
- Check forward, backward, and skip-out behavior.
- Check keyboard, pointer, touch, and narrow layouts when interaction changes.
