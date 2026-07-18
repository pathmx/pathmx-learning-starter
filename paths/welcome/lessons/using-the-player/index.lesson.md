---
type: lesson
status: active
start: Has opened the workspace but never used the PathMX player or run a learning session
destination: Can navigate a lesson in Play mode, interact with a component, and knows where progress and records live
---

# Using the Player

---

<!--
id: what-play-is
-->

## This page is playable

You can read this lesson like a normal document — or **play** it. Play walks
you through one focused step at a time.

- Press the **right arrow** (or click forward) to advance one step.
- Press the **left arrow** to go back.
- Each dash you just revealed is one *Beat* — the player's unit of focus.

If you are reading this outside Play, add `?play` to the page URL to try it.

---

<!--
id: try-a-component
-->

## Some steps are interactive

The next step is a flashcard. In Play, the forward arrow flips it — the
reveal is itself a step. Outside Play, click it or press Enter.

<flashcard label="Try me">
  <slot name="front">Where is your learning progress recorded?</slot>
  <slot name="back">In the path index and the activity log — files in this workspace, owned by you.</slot>
</flashcard>

[@learning]: ../../../assets/learning.components.md

---

<!--
id: where-things-live
-->

## Where things live

Three files carry your journey:

- [The path index](../../index.path.md) shows the map and your position.
- [The activity log](../../../learning.activity.md) records a short
  **synthesis** each time you complete a lesson: what you learned, what
  changed in how you see things, and what it opens next.
- [Your profile](../../../learner.profile.md) holds goals and preferences
  you choose to share.

When you finish a lesson, your agent updates the map and writes the
synthesis with you.

---

<!--
id: wrap-up
-->

## Check yourself

That is the whole mechanic: play forward, interact, and let the record
accumulate. Now prove it to yourself:

[Take the assessment](./lesson.assessment.md)
