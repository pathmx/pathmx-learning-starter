---
componentName: pathmx-mode-proof
---

# PathMX color-mode proof

```html
<div class="pathmx-mode-proof">
  <strong>Color-mode styling is active</strong>
  <span class="pathmx-mode-proof__light">Light component rules are active.</span>
  <span class="pathmx-mode-proof__dark">Dark component rules are active.</span>
</div>
```

```css
:self {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1.25rem;
  border: 2px dashed var(--pmx-color-accent);
  border-radius: var(--pmx-radius, 1rem);
}

:self .pathmx-mode-proof__light,
:self .pathmx-mode-proof__dark {
  display: none;
}

@light {
  :self {
    background: oklch(0.96 0.025 245);
    color: oklch(0.24 0.035 245);
  }

  :self .pathmx-mode-proof__light {
    display: inline;
  }
}

@dark {
  :self {
    background: oklch(0.22 0.035 245);
    color: oklch(0.94 0.015 245);
  }

  :self .pathmx-mode-proof__dark {
    display: inline;
  }
}
```
