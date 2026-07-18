# PathMX Literate Components

Literate Components define reusable custom tags in Markdown. Use them when
ordinary Markdown and CSS are not enough.

## Definition

Use `*.component.md` for one definition or `*.components.md` for a family. One
component Block contains exactly one `html` fence and optional `css` and `js`
fences.

````md
---
componentName: disclosure-card
---

# Disclosure Card

```html
<article aria-label="{{ label: Details }}">
  <button type="button" data-toggle>Toggle</button>
  <div data-body><yield /></div>
</article>
```

```css
:self { display: grid; gap: 0.75rem; }
```
````

Import and use the definition:

```md
<disclosure-card label="Why this works">
  The explanation remains readable Markdown.
</disclosure-card>

[@cards]: ./cards.components.md
```

`{{ name }}` reads a prop. `{{ name: fallback }}` supplies a default.
`<yield />` receives all children. Named `<slot>` elements create regions.

## CSS and resources

Component CSS is scoped to its rendered roots:

```css
:self { display: grid; }
@dark { :self { color-scheme: dark; } }
@container pathmx-runtime (max-width: 36rem) { :self { gap: 0.5rem; } }
```

Use `:self` for the root. Use the `pathmx-runtime` container for layout that
should follow the content surface.

Declare local resources in the definition Block:

```md
[@asset.renderer]: ./vendor/renderer.mjs
[@data.samples]: ./samples.json
[@script.behavior]: ./behavior.js
```

Read them through `ctx.assets`, `ctx.data`, and the component script contract.

## Instance scripts

Each script runs once for one rendered root. PathMX owns discovery and cleanup.
Do not scan the whole page.

| Local | Use |
| --- | --- |
| `el`, `$`, `$$` | Current root and scoped queries. |
| `on` | Events with automatic cleanup. |
| `state` | One Player-visible state domain. |
| `ctx.attrs`, `ctx.props` | Usage and merged props. |
| `ctx.assets`, `ctx.data` | Named resources. |
| `ctx.state` | Private browser state. |
| `ctx.effect`, `ctx.cleanup` | Pausable work and disposal. |

Keep scripts owned by `el`. Register timers, observers, and global listeners
for cleanup.

## State and Play

| Declaration | Behavior |
| --- | --- |
| `states="front \| back"` | Ordered states become Play steps. |
| `states="html, css, js"` | Unordered states remain one Beat. |

Use `state.get()`, `state.set(name)`, and `state.on(listener)`. Use ordered
states only for meaningful learning stages. Component state is not durable
learner evidence.

## Live proof

<flip-note label="Flip to reveal">
  <slot name="front">Where does Player-visible state live?</slot>
  <slot name="back">In the component's named state domain.</slot>
</flip-note>

[@flip-note]: ./assets/pathmx-flip-note.components.md

## Review

- Use a stable component name.
- Keep markup semantic and keyboard accessible.
- Keep yielded content useful without JavaScript.
- Separate Player-visible state from private state.
- Test without Play and through ordered Play states.
- Test narrow widths, reduced motion, cleanup, and failure paths.
- Build and inspect component diagnostics.
