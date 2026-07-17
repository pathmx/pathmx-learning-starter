---
componentName: flip-note
---

# Flip Note

A minimal stateful component used by the literate components reference as a
live example. It shows the smallest useful contract: named slots, one prop
with a fallback, an ordered two-state domain that Play can traverse, scoped
CSS with a state selector, and a script that flips state on click or key.

```html
<article class="flip-note" states="front | back" tabindex="0" role="button" aria-label="{{ label: Flip note }}">
  <div data-side="front"><slot name="front" /></div>
  <div data-side="back"><slot name="back" /></div>
  <p data-hint>Click or press Enter to flip</p>
</article>
```

```css
:self {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--pmx-color-border, currentColor);
  border-radius: var(--pmx-radius, 0.75rem);
  background: var(--pmx-color-surface, transparent);
  cursor: pointer;
}

:self [data-side="back"],
:self[data-state="back"] [data-side="front"] {
  display: none;
}

:self[data-state="back"] [data-side="back"] {
  display: block;
}

[data-hint] {
  font-size: 0.8em;
  color: var(--pmx-color-muted, inherit);
  margin: 0;
}

@dark {
  :self {
    box-shadow: 0 0.25rem 1rem oklch(0 0 0 / 0.4);
  }
}
```

```js
function flip() {
  state.set(state.get() === "back" ? "front" : "back")
}

on(el, "click", flip)
on(el, "keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    flip()
  }
})
```
