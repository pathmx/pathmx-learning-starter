import { expect, it } from "bun:test"
import { parseLearningTurnProposal } from "../src/learning/proposals"

function proposal(markdown: string, title = "A safe title") {
  return {
    type: "learning-turn",
    blocks: [{ id: "next-step", title, markdown }],
  }
}

it("accepts bounded ordinary Markdown", () => {
  expect(
    parseLearningTurnProposal(
      proposal("Compare the two ideas:\n\n- First\n- Second"),
    ).blocks[0]?.id,
  ).toBe("next-step")
})

it("rejects model output that could forge PathMX Block structure", () => {
  expect(() =>
    parseLearningTurnProposal(
      proposal("Useful prose\n\n---\n\n<!--\ntype: hidden\n-->"),
    ),
  ).toThrow("contains Source structure")
  expect(() =>
    parseLearningTurnProposal(proposal("Useful prose", "<!-- hidden -->")),
  ).toThrow("title exceeds")
})
