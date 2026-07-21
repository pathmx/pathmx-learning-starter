# PathMX Library

Use this library for reusable learner-facing material. Every item is local,
fictional where it depicts learners, and verified against the repository's
pinned PathMX baseline.

## Choose an item

| Kind | Use | Contents |
| --- | --- | --- |
| Pattern | Apply a stable design shape without copying syntax | [Complete session arc](./patterns/complete-session-arc.md) |
| Template | Copy and replace author notes | [Personal learning](./templates/learn/path/index.path.md), [shared path](./templates/teach/path/index.path.md) |
| Component | Copy a verified Literate Component | [Feedback panel](./components/feedback-panel.components.md) |
| Example | Inspect a complete fictional implementation | [Personal SQL module](./examples/learn-sql-foundations/paths/sql-foundations/index.path.md), [shared component use](./examples/shared-components/index.path.md) |

## Use the library

1. Read the destination repository instructions and pinned PathMX version.
2. Choose the smallest relevant item. Do not copy an entire example when one
   pattern or component is enough.
3. Copy templates and components into the destination repository. Never make
   learner Sources depend on an installed skill directory at runtime.
4. Replace every author note, fictional detail, placeholder, and irrelevant
   convention.
5. Preserve readable Markdown and relative links.
6. Build, resolve the exact route, and review the result in Player.

Library status means the PathMX contract is stable at the pinned baseline. It
does not mean the learning design fits every audience. Adapt through `learn`
for one learner or `teach` for a path shared by many learners.

Keep experimental or diagnostic-only syntax in test fixtures until it is
useful, documented, and ready for reuse.
