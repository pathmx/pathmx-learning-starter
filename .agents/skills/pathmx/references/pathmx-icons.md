# Lucide Icons

Use PathMX Lucide shortcodes for small inline cues, link labels, and
UI-adjacent content. Keep meaningful text visible whenever space allows.

## Syntax

```md
:lucide-sparkles:
:lucide-info[Information]:
[:lucide-book-open: Read the lesson](./lesson.md)
[:lucide-arrow-right[Continue]:](./next.md)
```

Use a Lucide icon name in kebab-case after `lucide-`. Do not repeat the prefix
inside the name.

Shortcodes work in prose, headings, lists, Markdown link labels, and text nodes
inside authored HTML:

<p>:lucide-pen-tool: Author with ordinary Markdown.</p>

This decorative cue :lucide-sparkles: inherits the current text color.

[:lucide-arrow-right[Continue to icon choices]:](#choose-icons)

[:lucide-book-open: Review icon choices](#choose-icons)

## Accessibility

- Use `:lucide-name:` when the icon is decorative. PathMX hides it from
  assistive technology.
- Use `:lucide-name[Label]:` when the icon alone carries meaning. PathMX emits
  `role="img"` and the label as `aria-label`.
- Prefer a decorative icon plus visible link or button text. Use a labeled
  icon-only control only when the surrounding interface makes the action clear.
- Do not use an icon as the only distinction between success, warning, and
  error states.

## Choose icons

Use names from the Lucide set. Confirm uncertain names with a targeted build;
do not invent names from memory. An unknown name is a build error, and PathMX
keeps the original shortcode as readable fallback text.

## Styling

Icons render at `1em` with `currentColor`. Set `font-size` and `color` on the
surrounding element when possible. Use `.pmx-icon` for the wrapper and
`.pmx-icon__svg` for the SVG only when a local treatment needs a direct hook.

## Boundaries

- Keep shortcode examples in inline or fenced code when they should remain
  literal. PathMX also ignores shortcodes in comments, HTML attributes, and
  `code` or `pre` elements.
- Use Lucide only. PathMX does not provide a generic icon-pack shortcode.
- Do not add remote icon loading, icon fonts, size attributes, stroke-width
  attributes, variants, or custom shortcode classes; those contracts are not
  supported by this syntax.
