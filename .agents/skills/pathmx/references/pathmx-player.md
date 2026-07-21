# PathMX Player and Play

The Player reads built Source, Block, and Beat data. Use it as the primary
experience for learning material; do not send a learner to raw Markdown when a
Player route is available.

## Model

| Level | Use |
| --- | --- |
| Source | One page and route. |
| Block | One coherent phase created by `---`. |
| Beat | One focusable step inside a Block. |
| View mode | Free reading and navigation. |
| Play mode | Guided forward and backward traversal. |

The URL owns Play position through `?play=<BeatId>`. A fragment remains a
browse target. Never invent a Beat id: copy it from the current Player URL or
read it from built metadata.

## Keep a server available

Prefer the repository's script. A direct fallback is:

```sh
bunx pathmx play --print-url
```

Reuse a healthy listener only after confirming that its process and output
belong to the current repository. Do not terminate an unknown server. Keep the
Player running while the learner works.

Resolve a built Source route instead of guessing it:

```sh
bunx pathmx route paths/example.lesson.md --base-url http://127.0.0.1:3000
```

If the repository uses another output directory, pass the same `--out` value
to `bunx pathmx route`.

## Open and hand off routes

Use this order:

1. Open the exact route in an available integrated browser and verify it.
2. In Codex, prefer `@Browser`.
3. In Claude Code, use its Chrome integration when already configured.
4. Otherwise open the system browser.
5. If no browser can open, provide a clickable URL.

Link to the narrowest useful position:

- Source route for a page or path overview;
- stable Block fragment for one section;
- Play URL with a verified Beat id for an exact learning step.

State whether the link opens in View or Play mode. For a first-time learner,
explain forward, backward, exit, and free navigation briefly.

## Pacing controls

Authors control pacing with:

- Block boundaries;
- ordinary Markdown Beats;
- `play.steps` density for supported content;
- code focus steps such as `[1-2|3]`;
- Block-local table focus steps; and
- ordered Literate Component states.

Use Beats for meaningful reveals. Avoid turning every sentence into a step.

## Table steps

For one table in a Block, add a small ordered sequence:

```md
---

<!--
id: compare-cases
play:
  table:
    steps:
      - label: Compare inputs
        rows: 1-2
        columns: 1-3
      - label: Inspect output
        columns: 4
-->

## Compare cases

| Case | A | B | Output |
| --- | --- | --- | --- |
| One | 2 | 3 | 5 |
| Two | 4 | 5 | 9 |
```

Rows and columns are one-based. A step needs `rows`, `columns`, or both. Build
warnings fall back to ordinary row Beats.

## Review

- Check the first arrival in View and Play modes.
- Move forward, backward, and out of nested steps.
- Check direct Source, Block, and Beat links.
- Check keyboard, pointer, touch, and narrow layouts.
- Confirm hints and reveals do not hide essential content permanently.
- Reload once to catch stale route or asset assumptions.
