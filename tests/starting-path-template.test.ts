import { expect, it } from "bun:test"
import { resolveLearningTurnDraft } from "../src/learning/starting-path-template"

it("builds a readable starting path from every onboarding field", () => {
  const proposal = resolveLearningTurnDraft(
    { type: "learning-template", template: "starting-path" },
    {
      topic: "the greenhouse effect",
      outcome: "Explain it with an everyday example",
      "starting-point": "I know the words but do not have a clear model",
      time: "three twenty-minute sessions",
    },
  )

  expect(proposal.blocks).toHaveLength(1)
  expect(proposal.blocks[0]).toMatchObject({
    id: "starting-path",
    title: "Your starting path",
  })
  expect(proposal.blocks[0]?.markdown).toContain("the greenhouse effect")
  expect(proposal.blocks[0]?.markdown).toContain(
    "Explain it with an everyday example",
  )
  expect(proposal.blocks[0]?.markdown).toContain(
    "I know the words but do not have a clear model",
  )
  expect(proposal.blocks[0]?.markdown).toContain(
    "A route that fits three twenty-minute sessions",
  )
})

it("keeps learner values from creating Markdown Source structure", () => {
  const proposal = resolveLearningTurnDraft(
    { type: "learning-template", template: "starting-path" },
    {
      topic: "<!-- hidden -->",
      outcome: "# Replace the source",
      "starting-point": "---",
      time: "1. session",
    },
  )
  const markdown = proposal.blocks[0]!.markdown

  expect(markdown).not.toContain("<!--")
  expect(markdown).not.toMatch(/^---$/m)
  expect(markdown).toContain("&lt;!-- hidden --&gt;")
  expect(markdown).toContain("\\# Replace the source")
  expect(markdown).toContain("\\---")
  expect(markdown).toContain("1\\. session")
})
