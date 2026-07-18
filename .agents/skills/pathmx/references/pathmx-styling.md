---
theme:
  color:
    accent: oklch(0.62 0.16 245)
  measure: 72ch
---

# PathMX Styling

Use the narrowest layer that owns the visual choice.

| Need | Use |
| --- | --- |
| Color, type, measure, or shape tokens | `theme` frontmatter |
| CSS for one Block | `[@styles]` in that Block |
| CSS for one root graph | `[@root.styles]` in the root Source |
| CSS inside a component | Component CSS with `:self` |

## CSS imports

```md
[@styles]: ./lesson.css
[@styles.print]: ./print.css
[@root.styles]: ./course.css
```

Targets must be local CSS. `@styles` follows its Block. `@root.styles` applies
to the active root graph and is ignored with a warning outside the root.

Directive scope does not rewrite CSS selectors. Scope rules when they must not
match other documents:

```css
@scope (.pmx-document[data-pathmx-source="paths/example.lesson"]) {
  :scope {
    --lesson-accent: oklch(0.62 0.16 245);
  }
}
```

## Theme tokens

```yaml
theme:
  color:
    bg: oklch(0.98 0.01 250)
    fg: oklch(0.22 0.03 250)
    accent: oklch(0.62 0.16 245)
  prose:
    size: 1rem
    leading: 1.65
  measure: 72ch
  shape:
    radius: 0.75rem
  dark:
    color:
      bg: oklch(0.18 0.02 250)
      fg: oklch(0.94 0.01 250)
```

PathMX maps supported values to `--pmx-*` variables. Use `light` and `dark`
branches for mode-specific values. Do not assume a named theme preset exists.

## Fonts

Load a hosted stylesheet or local font, then select the family through theme
tokens:

```yaml
fonts:
  inter:
    family: Inter
    src: ./fonts/InterVariable.woff2
    weight: "100 900"
    display: swap
theme:
  font:
    body: '"Inter", var(--pmx-font-body)'
```

## Live proof

<div class="pathmx-styling-example">
  <strong>PathMX styling is active.</strong>
  <span>This Block imports local CSS and uses theme tokens.</span>
</div>

[@styles]: ./assets/pathmx-styling-example.css

## Review

- Check light and dark modes.
- Check narrow and wide layouts.
- Check keyboard focus, forced colors, and reduced motion.
- Check print when print styles changed.
- Check selector leakage and missing assets.
- Build and review warnings.
