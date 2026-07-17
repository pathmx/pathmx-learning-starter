---
title: PathMX Styling
theme:
  color:
    accent: oklch(0.72 0.14 245)
  prose:
    leading: 1.65
  measure: 72ch
  light:
    color:
      surface: oklch(0.97 0.02 245)
  dark:
    color:
      surface: oklch(0.24 0.04 245)
---

# PathMX Styling

Style PathMX with local CSS imports and the source-level `theme` and `fonts` frontmatter fields. Prefer theme tokens for global visual choices and imported CSS for custom elements or layouts.

## Quick choice

| Need | Use |
| --- | --- |
| Source or Block CSS | `[@styles]: ./styles.css` |
| Print-only CSS | `[@styles.print]: ./print.css` |
| Screen-only CSS | `[@styles.screen]: ./screen.css` |
| CSS shared by a whole root bundle | `[@root.styles]: ./bundle.css` in the root Source |
| Colors, typography, measure, or code tokens | `theme` frontmatter |
| Hosted or local font registration | `fonts` frontmatter |
| Light/dark CSS variants | `@light {}` and `@dark {}` |

---

## Style imports

Define a local CSS file with a PathMX reference-definition directive:

```md
[@styles]: ./lesson.css
```

The import belongs to the Block containing the definition. An imported or transcluded Block carries its own style dependency with it.

Add a media scope with the directive name:

```md
[@styles.print]: ./lesson-print.css
[@styles.screen]: ./lesson-screen.css
```

For CSS needed across every Source reachable from a root, place this only in the active root Source:

```md
[@root.styles]: ./styles/course.css
```

Rules:

- Use a relative local `.css` file.
- Keep the file inside the Source root.
- Use `@styles` for Block-scoped CSS.
- Use `@root.styles` only in a root Source; PathMX warns and ignores it elsewhere.
- Use unique class names so imported styles do not accidentally affect unrelated content.

---

## Theme tokens

Set `theme` in Source frontmatter. PathMX converts supported fields to CSS custom properties.

```yaml
---
theme:
  color:
    bg: oklch(0.98 0.01 250)
    fg: oklch(0.22 0.03 250)
    muted: oklch(0.55 0.03 250)
    surface: oklch(0.94 0.02 250)
    link: oklch(0.55 0.18 250)
    accent: oklch(0.68 0.17 250)
    danger: oklch(0.62 0.21 25)
    border: oklch(0.82 0.03 250)
    focus: oklch(0.72 0.16 250)
  font:
    body: Inter, system-ui, sans-serif
    heading: Inter, system-ui, sans-serif
    mono: ui-monospace, monospace
  prose:
    size: 1rem
    leading: 1.65
    flow: 1.5em
  measure: 72ch
  shape:
    radius: 1rem
  code:
    bg: oklch(0.18 0.02 250)
    fg: oklch(0.94 0.01 250)
---
```

Common mappings:

| Theme field | CSS token |
| --- | --- |
| `color.bg`, `color.fg`, `color.accent` | `--pmx-color-bg`, `--pmx-color-fg`, `--pmx-color-accent` |
| `font.body`, `font.heading`, `font.mono` | `--pmx-font-body`, `--pmx-font-heading`, `--pmx-font-mono` |
| `prose.size`, `prose.leading`, `prose.flow` | `--pmx-prose-size`, `--pmx-prose-leading`, `--pmx-prose-flow` |
| `measure` | `--pmx-document-measure` |
| `shape.radius` | `--pmx-radius` |
| `code.bg`, `code.fg` | `--pmx-code-bg`, `--pmx-code-fg` |

Theme values are CSS values. Prefer OKLCH for authored colors because its lightness and chroma are easier to adjust consistently.

### Light and dark theme branches

Put shared values at the top level and scheme-specific overrides under `light` and `dark`:

```yaml
theme:
  color:
    accent: oklch(0.68 0.17 250)
  light:
    color:
      bg: oklch(0.98 0.01 250)
      fg: oklch(0.22 0.03 250)
  dark:
    color:
      bg: oklch(0.18 0.02 250)
      fg: oklch(0.94 0.01 250)
```

To lock a Source to one scheme, use `forceColorScheme: light` or `forceColorScheme: dark`. Do this only when the content truly cannot adapt.

---

## Fonts

Register hosted or local fonts in top-level `fonts` frontmatter, then use the family through `theme.font`.

### Hosted stylesheet

```yaml
fonts:
  inter:
    href: https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap
theme:
  font:
    body: Inter, system-ui, sans-serif
```

Hosted font URLs must use HTTPS. A `media` field is optional.

### Local font

```yaml
fonts:
  courseSans:
    family: Course Sans
    src: ./assets/course-sans.woff2
    weight: 400 700
    style: normal
    display: swap
theme:
  font:
    body: Course Sans, system-ui, sans-serif
```

Local fonts must stay inside the Source root. PathMX accepts `.woff2`, `.woff`, `.ttf`, and `.otf`; prefer `.woff2`. Optional local fields are `weight`, `style`, `stretch`, `display`, and `unicodeRange`.

---

## Color modes in authored CSS

Use `@light` and `@dark` inside Literate Component CSS:

```css
.course-card {
  border: 2px solid var(--pmx-color-accent);
  background: var(--pmx-color-surface);
}

@light {
  .course-card {
    box-shadow: 0 0.5rem 2rem oklch(0.35 0.04 250 / 0.12);
  }
}

@dark {
  .course-card {
    box-shadow: 0 0.5rem 2rem oklch(0.02 0.02 250 / 0.45);
  }
}
```

PathMX expands these blocks for system preference and the Player's selected scheme. Do not target internal `data-pathmx-color-scheme` attributes yourself.

In PathMX 0.1.13, the Literate Component compiler performs this expansion. Standalone files loaded with `@styles` are copied as written, so use standard CSS in those files rather than placing `@light` or `@dark` in them.

---

id: rendered-styling-example
title: Rendered styling example

# Rendered styling example

The first card is styled by a real Block-scoped `@styles` import, and its border uses the Source's `theme.color.accent` token. The second card is a real Literate Component whose label changes through compiled `@light` and `@dark` rules.

<div class="pathmx-styling-example">
  <strong>PathMX styling is active</strong>
  <span>The imported CSS uses live PathMX theme tokens.</span>
</div>

<pathmx-mode-proof></pathmx-mode-proof>

```md no-copy
<div class="pathmx-styling-example">PathMX styling is active</div>

<pathmx-mode-proof></pathmx-mode-proof>

[@styles]: ./assets/pathmx-styling-example.css
[@widgets]: ./assets/pathmx-styling-mode.components.md
```

[@styles]: ./assets/pathmx-styling-example.css
[@widgets]: ./assets/pathmx-styling-mode.components.md

---

## Verification

Build into a scratch directory and inspect all warnings:

```sh
pathmx build skills/pathmx/references/pathmx-styling.md \
  -o /tmp/pathmx-styling-check \
  --clean
```

Then open the Source with `pathmx play` and verify both light and dark modes. Confirm that imported styles load, theme variables have the expected computed values, and the browser console has no relevant errors.

## Best practices

- Start with theme tokens before writing custom CSS.
- Keep CSS imports local and Block-scoped unless the entire root bundle needs them.
- Prefer semantic classes over generated Player selectors.
- Use PathMX tokens such as `--pmx-color-accent` so custom elements follow the theme.
- Author light/dark differences with `@light` and `@dark`.
- Register fonts through `fonts`; do not hand-write duplicate `@font-face` rules.
- Rebuild after every styling change and treat warnings as failures to investigate.
