# PathMX Player

<!-- TODO: draft. Ground truth: pathmx repo — paths/docs/play-authoring.design.md,
     paths/docs/specs/pathmx-play-mode.spec.md,
     packages/build/src/plugins/core/choreographer/ -->

How the PathMX player turns a built Source into a guided, focused learning
sequence — and how to author content that plays well.

## Play model

<!-- TODO: Blocks are the coarse stops, Beats the fine-grained stops. The build
     choreographer annotates the rendered HTML (`data-pathmx-beat*`); the player
     only reads those annotations — structure is fixed at build time. -->

## Focus levels

<!-- TODO: the three focus levels — `block` (slide-like, one stop per `---`
     Block), `browse` (headings as map stops, free scroll), `step` (paragraphs,
     list items, table rows, media, display math, code steps, component
     states). -->

## Navigation

<!-- TODO: forward/backward, skip-out (one nesting level per press), seen beats
     dim, active beat carries `data-pathmx-play-state="active"`. Play position
     is owned by the URL: `?play=<BeatId>`; `#fragment` is browse/scroll only. -->

## Pacing controls (authoring)

<!-- TODO: what authors control — Block structure (`---`), `play.steps` density
     (tables/lists/code), code focus steps, table focus steps, ordered
     component `states`. Link to pathmx-markdown.md (Beats) and pathmx-code.md. -->

## Interactive beats

<!-- TODO: play navigation and direct clicks drive the same component state
     channel; component state persists when play moves on; components must work
     fully outside play. Gated beats (can't advance until answered) are
     designed but not yet implemented — do not author against them. -->

## Authoring for LX

<!-- TODO: one Block = one coherent move; keep meaningful stages as
     addressable Beats; don't hide learning steps inside an opaque component
     loop; the structure you write IS the route. -->
