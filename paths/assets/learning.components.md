---
componentName: learning-reveal
---

# Learning reveal

A staged prompt with ready help. Player treats the ordered states as learning
steps. The button provides the same reveal outside Play.

```html
<aside class="learning-reveal" states="prompt | hint | answer" aria-label="{{ label: Learning prompt }}">
  <div data-stage="prompt"><slot name="prompt" /></div>
  <div data-stage="hint"><slot name="hint" /></div>
  <div data-stage="answer"><slot name="answer" /></div>
  <button type="button" data-next>Show hint</button>
</aside>
```

```css
:self {
  display: grid;
  gap: 1rem;
  margin-block: 1.5rem;
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--pmx-color-border, currentColor);
  border-radius: var(--pmx-radius, 0.9rem);
  background: color-mix(in oklch, var(--pmx-color-surface, transparent) 94%, var(--pmx-color-accent, currentColor));
  box-shadow: 0 0.75rem 2rem color-mix(in oklch, var(--pmx-color-fg, currentColor) 8%, transparent);
}

:self [data-stage] {
  display: none;
}

:self:not([data-state]) [data-stage="prompt"],
:self[data-state="prompt"] [data-stage="prompt"],
:self[data-state="hint"] [data-stage="hint"],
:self[data-state="answer"] [data-stage="answer"] {
  display: block;
}

:self > button {
  justify-self: start;
  min-height: 2.75rem;
  padding: 0.65rem 1rem;
  border: 0;
  border-radius: calc(var(--pmx-radius, 0.9rem) * 0.72);
  background: var(--pmx-color-accent, currentColor);
  color: var(--pmx-color-bg, white);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

:self > button:focus-visible {
  outline: 3px solid color-mix(in oklch, var(--pmx-color-accent, currentColor) 35%, transparent);
  outline-offset: 3px;
}

:self[data-state="answer"] > button {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  :self [data-stage] {
    animation: learning-reveal-in 180ms ease-out;
  }
}

@keyframes learning-reveal-in {
  from { opacity: 0; transform: translateY(0.25rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

```js
const order = ["prompt", "hint", "answer"]
const button = $("[data-next]")

function render() {
  const current = state.get() || "prompt"
  button.textContent = current === "prompt" ? "Show hint" : "Show example"
}

function advance() {
  const current = state.get() || "prompt"
  const index = order.indexOf(current)
  state.set(order[Math.min(index + 1, order.length - 1)])
}

on(button, "click", advance)
state.on(render)
render()
```
