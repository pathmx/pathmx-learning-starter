# PathMX Annotations

Use annotations for durable feedback and discussion anchored to a Source,
Block, Beat, or selected text. Prefer the Player's annotation controls or an
installed PathMX annotation tool over hand-editing thread syntax.

## Source shape

An annotation is a Markdown footnote family. The anchor is an ordinary
footnote reference and the definitions hold the discussion:

```md
Photosynthesis turns light into stored chemical energy.[^c1]

[^c1]: **@learner** (2026-07-20 10:30 -04:00): I understand the words, but not
    where the stored energy actually goes.

[^c1.a]: **@agent** (2026-07-20 10:42 -04:00): I will add a concrete glucose
    example to the next session.
```

A resolved parent ends with an indented resolution line:

```md
[^c1]: **@learner** (2026-07-20 10:30 -04:00): I understand the words, but not
    where the stored energy actually goes.

    ✓ @learner 2026-07-20 11:05 -04:00
```

Keep the anchor and thread after resolution so the learning history remains
readable. Do not manufacture actor names or timestamps.

## Text selections

PathMX may preserve a selected range with a comment marker:

```md
The energy becomes {==stored in chemical bonds==}[^c2].

[^c2]: **@learner** (2026-07-20 10:35 -04:00): Can we make this more concrete?
```

Create these through Player or PathMX tooling. Marker placement around code and
tables is version-sensitive and should not be improvised.

## Learning workflow

- Invite learners to annotate confusion, disagreement, useful connections, or
  requests for more depth.
- Review open threads before changing future curriculum.
- Reply when the discussion itself is useful history.
- Revise future Sources when feedback reveals a curriculum problem.
- Resolve only after the concern is addressed or the learner confirms it.
- Never delete learner-authored threads merely to make a Source look clean.

Annotations are asynchronous feedback. Do not make the learner wait for an
agent response before continuing a prepared session.

## Review

- Confirm the anchor still points at the intended rendered material.
- Check open and resolved state in the Player.
- Preserve attribution and chronological order.
- Build with the installed PathMX version.
- Use a disposable copy when testing actions that write annotation data.
