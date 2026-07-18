# PathMX Directives

PathMX directives use ordinary Markdown links with an implemented `@` label.
Without an implemented label, the syntax remains a normal link or definition.

## Includes

Render another Source or Block inline:

```md
[@include: Shared note](./shared.include.md)
[@include: One section](./shared.include.md#summary)
```

Use a named definition when the include is referenced in prose:

```md
[Read the shared note here][@include.note]

[@include.note]: ./shared.include.md#summary
```

Included content keeps its Source identity while its Beats are projected into
the host Block.

## Imports

Import local CSS or components with reference definitions:

```md
[@styles]: ./lesson.css
[@styles.print]: ./print.css
[@root.styles]: ./course.css
[@widgets]: ./widgets.components.md
```

`@styles` belongs to its Block. `@root.styles` belongs only in the active root
Source. Read [Styling](./pathmx-styling.md) before choosing scope.

## Component resources

Declare local resources in a component definition Block:

```md
[@script.behavior]: ./behavior.js
[@asset.renderer]: ./vendor/renderer.mjs
[@data.samples]: ./samples.json
```

Component scripts read assets through `ctx.assets` and data through `ctx.data`.
Do not invent directive labels or resource APIs; use the installed version's
local examples and help.

## Review

- Keep link labels readable.
- Use local relative targets.
- Confirm the directive exists in the installed version.
- Build and review every warning.
