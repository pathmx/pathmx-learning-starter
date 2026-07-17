# PathMX Directives

<!-- TODO: draft. Ground truth: pathmx repo — plugins/core/{include,styles,
     resources}/, paths/demos/includes.demo.md. -->

`@`-prefixed directives written as ordinary markdown links and reference
definitions: includes, imports, and resources. The `@` prefix marks a PathMX
directive; without it, the same syntax is a normal link.

## Includes (transclusion)

<!-- TODO: the three forms —
     `[@include: Label](./shared.include.md)`,
     block targeting via `#block-id`,
     named reference form `[Label][@include.name]` + `[@include.name]: ./x.md`.
     Included content renders inline; its headings/paragraphs become Beats in
     the host Block. -->

## Imports

<!-- TODO: component imports `[@widgets]: ./widgets.components.md`;
     style imports `[@styles]: ./x.css`, `[@styles.print]:`, `[@root.styles]:`
     (see pathmx-styling.md for scope/cascade). -->

## Component resources

<!-- TODO: `[@script.*]`, `[@asset.*]`, `[@data.*]` declared in a component
     definition Block; surfaced via `ctx.assets` / `ctx.data`
     (see pathmx-literate-components.md). -->

<!-- NOTE: spaceholders (@spaceholder generated-content directives) are
     deliberately excluded from this skill for now — the design is in flux and
     has not landed. Do not document or author spaceholder syntax until the
     final design ships in the pathmx repo. -->
