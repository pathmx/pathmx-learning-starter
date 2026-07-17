---
name: learn
description: Teach the user a new skill or concept, within this workspace.
disable-model-invocation: true
argument-hint: "What would you like to learn?"
adapted-from: https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md
---

# Make Paths

This skill creates interactive, immersive, personalized learning paths based on what a user wants to learn. This creates a knowledge repository that is maintained over time and can serve as a home base for all of the user's learning goals and material. These paths are built with PathMX (Paths Markdown eXtension).

This creates learning paths inside a PathMX repository. Use the `/pathmx` skill when authoring PathMX content.

## The Learning Loop

Everything this skill does is one loop, applied at two levels:

1. **Assess position** — where is the learner now?
2. **Aim** — set a measurable target (B) with evidence criteria.
3. **Experience** — build and play a lesson at the proximal edge.
4. **Assess outcome** — did the evidence meet the target? If not, remediate and loop.
5. **Record & advance** — log the evidence, move the current position forward, and re-aim if needed.

The **path** runs this loop over the whole journey: its A is captured at intake and kept in `path.outcome.md` as the baseline, alongside its B. Each **lesson** runs the same loop in miniature: its A is the current position tracked in `index.path.md`, and its B is the lesson outcome checked by `lesson.assessment.md`.

The two levels feed each other:

- Closing a lesson loop **advances the path's current position** in `index.path.md`.
- Lesson evidence may reveal that the path's B should change — the learner discovers what they actually want. That is healthy, but never silent: **renegotiate B with the learner explicitly and record the change in `learning.activity.md`**.

Progress is a spiral, not a line. Closing a loop does more than move the marker forward — it elevates the learner's vantage: new capabilities, new questions, sometimes a changed goal. That is why B renegotiation is normal, and why each loop closes with a **synthesis** (workflow step 10) rather than a checkmark. The synthesis — not the checkmark — is what carries forward as the next lesson's A.

The loop stops at the lesson level. Blocks and Beats do not get A/B points — pacing inside a lesson belongs to PathMX Play (see the /pathmx skill).

This is also why the path is never built ahead: the next lesson's A does not exist until the current loop closes.

## Workflow

Before starting, make sure there is a PathMX repository already scaffolded, running, and up-to-date. See the pathmx skill for details.

### Returning sessions

If the workspace already has a path in progress, re-enter the loop where it paused before teaching anything new:

1. Read `learner.persona.md`, `learning.activity.md` (especially the most recent synthesis record), and the active path's `index.path.md`.
2. Greet the learner with a short "here's where we left off" recap.
3. Warm up with 2-3 quick recall prompts drawn from earlier lessons.
4. Continue from the position in the path index, informed by the last synthesis.

### Starting a new path

Steps 1-4 open the outer loop (assess A, aim B). Steps 5-10 are one full lesson loop — repeat them for each lesson until the path's B is met.

1. Start with a broad question: ask the user "what would you like to learn about?"
2. From there, help the learner narrow it down to a specific, outcome-focused, actionable goal. Keep drilling down until you reach a shared consensus on the goal and an actionable outcome. If the learner just wants to explore a topic, that is also fine, but it should be well-stated.
3. Next, we should define the A->B (start and destination) points for the path.
    - **Find Point A:** Where is the learner starting in the desired domain? Keep the interview brief and prefer assess-by-doing: a short diagnostic lesson in the player yields better evidence than a questionnaire and gives the learner something to play in the very first session. Encourage the learner to share links, projects, and artifacts. We will reference these links later, so add them to the user's learning records log (see below for how).
    - **Find Point B:** This is the outcome/goal of the learning path. It should be specific enough to be measurable and have a basic rubric.
4. Once A/B information has been collected, start by creating (or updating) the path folder/index.path.md with an outline of what will be taught. Do not prepare or link the lesson, yet. Just the outline.
5. Prepare the next lesson. Its A comes from the current position *and* the most recent synthesis — not just "previous lesson: done". Record the lesson's own loop in its frontmatter as `start:` and `destination:` (one sentence each, phrased as learner capability). Prepare a lesson that is on the **proximal edge** towards the destination. Unless it is the first lesson, open it with 2-3 retrieval prompts from earlier lessons. Use the /pathmx authoring skill to make the lesson block-by-block (so the learner can watch it build in their player).
6. Prepare an assessment that will gauge whether the learner has reached the lesson's `destination`.
7. Once the lesson and assessment are prepared, ask the learner if they are ready to start and preview what they will be able to do by the end.
8. Help the learner get through the lesson by asking questions, checking for learner input (if present), and responding to any questions the learner has. Update the lesson as needed to help the learner understand. Update the assessment as needed when the lesson changes.
9. Once the learner is ready to move on, point them to the assessment and gate any further lessons until they have adequately demonstrated their skill. If the assessment reveals gaps, do not simply repeat it: revise the lesson, or insert a smaller intermediate lesson targeting the gap, then re-assess.
10. Finally, record the completion: mark the lesson complete in `index.path.md` so progress is visible on the path, and add a **synthesis** record to `paths/learning.activity.md` linking to the lesson and any learning artifacts. A synthesis records three things: what was learned (the evidence), what changed in how the learner sees the domain or the goal, and what this opens up next. That third element seeds the next lesson's A.

<!-- should we prompt to setup a progress-checking automation/schedule task? -->

Don't build the whole path up front; outline the overall structure and build only the next lesson or two, so the path can adapt to what the assessments reveal.

## Learning Path IA

A learning path is a `*.path.md`, usually `index.path.md`, covering A->B points for a learner and outcome.

- Path: the overall learning from A -> B
    - Lessons: an actionable unit of focused work; ideally completable in one session with a tight outcome
        - Blocks: the content within a lesson (like slides) that guides the learner through the experience

When a path grows large enough to need grouping, organize lessons into modules/units (weeks, themes) as sections of `index.path.md` — modules are an organizational view of the index, not a folder layer.

Avoid calling path-level units "steps": step already has a specific meaning in PathMX Play (step focus, code/table steps).

```text
paths/
├── learner.persona.md          # learner profile
├── learning.activity.md        # global learning record
├── theme.css                   # a nice theme for the learning space
└── <path-name>/
    ├── index.path.md           # path structure + progress
    ├── path.outcome.md         # goal, outcome, rubric
    ├── lessons/
    │   └── <lesson-name>/
    │       ├── index.lesson.md
    │       └── lesson.assessment.md
    └── references/
        ├── index.references.md         # a list of all the references used in this path
        └── <name>.reference.md
```

- **`learner.persona.md`** — the learner's profile: name, bio, avatar (if provided), goals, motivations, personality details, preferences, etc.
- **`learning.activity.md`** — the global record of learning activity/evidence across all paths, including any renegotiations of a path's B. Each record is its own block, written as a synthesis (evidence, shift in perspective, what it opens next), and links to the relevant lesson, assessment, and evidence material. In some cases evidence should be snapshotted as its own PathMX source (`*.evidence.md`) and linked from the record.
- **`index.path.md`** — the overall structure of the path, with links to each active lesson; tracks the current position (the moving A of the lesson loop).
- **`path.outcome.md`** — the A-point baseline and the overall goal/outcome (the path's B), plus a rubric for evaluating the result.
- **`lessons/`** — individual lessons used by the path. Each `index.lesson.md` records its own loop in frontmatter as `start:` and `destination:` — one sentence each, phrased as learner capability, written when the lesson is authored and left as a historical snapshot. The live position belongs to `index.path.md`; measurable criteria belong to the assessment.

  ```yaml
  ---
  type: lesson
  start: Can write single-table SELECT queries; joins are unfamiliar
  destination: Can combine two tables with INNER and LEFT JOIN and explain the difference
  ---
  ```

  - **`lesson.assessment.md`** — the evaluation of the learner against the lesson's `destination`; can be quiz/question based and/or backed by uploaded/local evidence.
- **`references/`** — reference/support materials that back up lesson content; usable as learning resources or as material for building out new lessons.

See [example.md](./example.md) for a worked example of these files mid-path: a closed lesson loop with its synthesis, an active lesson with `start`/`destination` frontmatter, and a recorded B renegotiation.

## Philosophy/Pedagogy

- **Backward design.** Define the outcome and rubric (Point B) before any content. Every lesson should trace to the outcome.
- **Zone of proximal development.** Teach at the proximal edge, where the learner is challenged just enough. Locate that edge with A-point evidence and assessment results, not assumptions.
- **Knowledge, then skill, through a tight feedback loop.** Teach only the knowledge required for the skill at hand, then have the learner practice with immediate feedback: answers, quizzes, agent checks, or real artifacts. For acquiring knowledge, difficulty is the enemy; for practicing skills, difficulty is the tool.
- **Storage strength over fluency.** In-the-moment recall (fluency) creates an illusion of mastery; long-term retention (storage strength) is the goal. Build it with desirable difficulty:
  - *Retrieval practice* — recalling from memory beats re-reading; hence the warm-up prompts.
  - *Spacing* — revisit earlier material across sessions instead of massing practice.
  - *Interleaving* — mix related skills in practice once there is more than one to mix.
- **Small, concrete wins.** Working memory is limited. Each lesson delivers one tangible, completable win the learner can build on.
- **Evidence over impressions.** Gate progression on demonstrated skill, record it in the learning records, and let the records — not memory — drive what comes next.
