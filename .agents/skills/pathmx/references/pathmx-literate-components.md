# PathMX Literate Components

Literate components let authors define reusable custom tags in plain markdown: a Block of prose explaining the component, plus fenced `html`/`css`/`js` code that PathMX compiles into the tag. They are the primary tool for bespoke learning UX — interactions the built-in markdown extensions can't express. Components hot-reload during live authoring and integrate with Play so the player's forward arrow can drive component state.

Write the definition file as a literate program: explain purpose, props, slots, and behavior in prose before or beside each fence. The prose is for humans and agents; only the fences and `[@…]` resource links are compiled.

## Quick reference

| Need | Use |
| --- | --- |
| Define one component | `widget.component.md` — one Block, one `html` fence |
| Define a family | `widgets.components.md` — one component per Block |
| Import into a document | `[@widgets]: ./widgets.components.md` |
| Use | `<widget label="...">children</widget>` |
| Prop with default | `{{ label: Fallback text }}` in the template |
| Children | `<yield />` (all) or `<slot name="x" />` (region) |
| Root CSS scope | `:self { ... }` |
| Play-traversable states | `states="a | b"` (pipe = ordered) |
| One-Beat choice states | `states="a, b, c"` (comma = unordered) |

---

## Definition files

A component source is any `*.component.md` (single component), `*.components.md` (family), or a source with `parseComponents: true` in frontmatter. Each Block defines at most one component and **must contain exactly one `html` fence** (the template); `css` and `js`/`javascript` fences are optional and there can be several of each — they concatenate in authored order.

The component's name becomes its tag name. Resolution order:

1. Block `componentName` (topmatter)
2. Source `componentName` frontmatter — single-definition sources only
3. The filename — `flip-note.components.md` names a single definition `flip-note`
4. Block `title`, then the Block's first heading, normalized to kebab-case (`# Flip Note` → `<flip-note>`)

Prefer an explicit `componentName` or a stable filename for any component other sources use — otherwise editing a presentation heading silently renames the tag. Duplicate resolved names are a build **error** (`literate/duplicate-component`).

---

## Templates and props

```html
<article class="flip-note" states="front | back" aria-label="{{ label: Flip note }}">
  <div data-side="front"><slot name="front" /></div>
  <div data-side="back"><slot name="back" /></div>
</article>
```

- The template's **first element** becomes the rendered root. Usage attributes are copied onto it (`class` is merged, not replaced).
- `{{ prop }}` interpolates a usage attribute; `{{ prop: fallback }}` supplies a default. Resolution: usage attribute → template default → Block data → Source data.
- `<yield />` receives all usage children. `<slot name="x" />` receives the content of a matching `<slot name="x">…</slot>` in the usage.
- Props work anywhere in the template string, including inline styles: `style="--card-ratio: {{ ar: 4 / 3 }}"` is the standard way to pass numbers into CSS.
- Markdown **inside component children renders normally** (math, fences, emphasis) because components resolve after markdown rendering. Separate markdown content from the surrounding tags with blank lines.

Use semantic, accessible HTML: native buttons, links, labels, and ARIA before recreating their behavior. Keep yielded content useful without JavaScript.

---

## Component CSS

Component CSS is scoped to that component's rendered roots via native `@scope`. Use `:self` for the root and ordinary selectors for descendants:

```css
:self {
  display: grid;
  border-radius: var(--pmx-radius, 0.75rem);
  background: var(--pmx-color-surface, transparent);
}

:self[data-state="back"] [data-side="front"] {
  display: none;
}

@dark {
  :self {
    color-scheme: dark;
  }
}

@container pathmx-runtime (max-width: 36rem) {
  :self {
    gap: 0.5rem;
  }
}
```

- `@dark {}` / `@light {}` compile to both the system preference and the Player's theme toggle — never target internal `data-pathmx-*` scheme attributes.
- Respond to the **content surface**, not the viewport: `@container pathmx-runtime (...)`. The runtime document is the container, so components adapt correctly when embedded or split.
- Use `--pmx-*` theme tokens (see [Styling](./pathmx-styling.md)) so components follow the repository theme.
- State-dependent appearance selects on `:self[data-state="..."]`.

---

## The instance script

Each `js` fence runs **once per rendered component root**. PathMX owns page scanning, init guards, live-reload reinitialization, and disposal — never write page-level `querySelectorAll` loops or init flags. These locals are in scope:

| Local | Meaning |
| --- | --- |
| `el` | this instance's rendered root |
| `$` / `$$` | `el.querySelector` / array-returning `el.querySelectorAll` |
| `on(target, type, fn)` | event listener with automatic cleanup |
| `state` | the Player-visible state domain: `get()`, `set(name)`, `on(listener)`, `declare(entries, opts)` |
| `ctx.attrs` / `ctx.props` | root attributes at init / definition defaults merged with attributes |
| `ctx.assets` / `ctx.data` | named resources: `ctx.assets.x.url`, `await ctx.data.x.json()` (cached) |
| `ctx.morph(target, next)` | identity-preserving DOM patch (default patches children; `{mode: "element"}` patches the target) |
| `ctx.transition(update)` | View Transition wrapper; falls back cleanly, respects reduced motion |
| `ctx.effect(fn, {when})` | restartable continuous work; `when: "visible"` or `"presented"` |
| `ctx.state(initial)` | private per-instance state — not Player-visible |
| `ctx.cleanup(fn)` | disposal registration (observers, timers, library handles) |
| `ctx.play.actions` | ephemeral Player context actions: `set([...])` / `clear()` |

`"visible"` means on screen; `"presented"` additionally means the component's Beat is active in Play — use it for animation loops and simulations so they pause when Play moves on:

```js
ctx.effect(({ signal }) => {
  const timer = setInterval(tick, 1000)
  return () => clearInterval(timer)
}, { when: "presented" })
```

Declare local files a component needs as resources in its definition Block, then read them through `ctx`:

```md
[@asset.renderer]: ./vendor/renderer.mjs
[@data.samples]: ./samples.json
```

```js
const renderer = await import(ctx.assets.renderer.url)
const samples = await ctx.data.samples.json()
```

---

## State and Play

One `states` attribute (on the template root or the usage tag) declares the component's Player-visible state domain — this is the core LX lever:

- `states="front | back"` — **pipe = ordered sequence.** Each state after the first becomes a Play step Beat: the player's forward/backward arrows traverse the states. Use for staged reveals, worked steps, before/after.
- `states="html, css, js"` — **comma = unordered choice set.** The component stays one Beat; the Player offers the states as digit-key choices. Use for tabs and alternate views.
- Never mix separators; never use purely numeric state names. `initial-state="back"` selects the start (default: first state; `initial-state=""` starts empty).

The script reads and drives the same domain with `state.get()` / `state.set(name)` / `state.on(listener)`. Play and direct interaction share one channel: on beat enter, the Player *requests* a state (a `pathmx:play-step` event on the root) and the component applies it — the Player never writes state itself. That is why a correct component works identically with and without Play, and why state persists when Play moves on (a flipped card stays flipped).

For data-driven sequences, declare the domain at runtime:

```js
state.declare(moves.map((m, i) => ({ name: `move-${i + 1}`, label: m.label })), { initial: null })
```

Block-level component roots receive `pathmx:beat-enter` / `pathmx:beat-exit` directly on `el` — listen there, never query Player chrome. For ephemeral in-component commands (Previous / Next / Reset view), publish `ctx.play.actions.set([...])` with stable ids and labels; keep boundary actions present-but-disabled so positional shortcuts stay stable. Context actions are browser-local — never use them for Save or Submit.

---

id: rendered-flip-note
title: Rendered flip note

# Rendered flip note

This Block imports and uses a real component defined in [`assets/pathmx-flip-note.components.md`](./assets/pathmx-flip-note.components.md). Click it (or focus and press Enter) to flip; in Play, the forward arrow flips it, because `states="front | back"` makes the back a step Beat.

<flip-note label="Flip to reveal">
  <slot name="front">Where does a component's state live?</slot>
  <slot name="back">On the element, as data-state — Play requests, the component applies.</slot>
</flip-note>

```md no-copy
<flip-note label="Flip to reveal">
  <slot name="front">Where does a component's state live?</slot>
  <slot name="back">On the element, as data-state — Play requests, the component applies.</slot>
</flip-note>

[@flip-note]: ./assets/pathmx-flip-note.components.md
```

[@flip-note]: ./assets/pathmx-flip-note.components.md

---

## Going further

The PathMX repository's demos form a difficulty ladder worth copying from:

- **Layout primitives** (template + CSS only, prop-driven data-attributes, container queries): `paths/demos/layout.components.md`
- **Minimal stateful component** (ordered states, small script): `paths/demos/flashcards.components.md` and its demo
- **Data-driven advanced contract** (`state.declare` from parsed data, `ctx.play.actions`, `ctx.assets`/`ctx.data`): `paths/demos/chess/chess.components.md`

Before building a large scene or simulation, write a short contract first: initial render, Player-visible vs. private state, reset behavior, continuous `presented` work, and failure/loading UI. Expose meaningful learning stages as ordered states or nested Beats; keep hover, camera, and purely visual state private.

## Not supported

Do not author against these — they do not exist in the portable baseline: TypeScript/JSX compilation, framework rendering (React/Vue/etc.), Shadow DOM, package/module resolution (import only from `ctx.assets` URLs), set-valued or numeric-counting states, and persistent component state. `ctx.response` and durable Save/Submit surfaces are version-gated — verify the installed PathMX version documents them before use; durable work goes through the project's Action contract, not component state.

## Verification

Build the changed sources into a scratch directory and treat warnings as results — the literate plugin has specific codes worth knowing: `literate/duplicate-component` (error), `literate/unresolved-component`, `literate/states-*` (mixed separators, single name, duplicates, numeric names), and `literate/state-initial-out-of-domain`.

```sh
pathmx build <document-using-the-component> -o .pathmx-check --clean
```

Then open it with `pathmx play` and check: the component renders and behaves without Play; Play traverses ordered states in order; state persists after Play moves on; narrow widths, dark mode, and keyboard interaction all behave; and the browser console is clean. See [Tooling & Verification](./pathmx-tooling.md) for the full workflow.
