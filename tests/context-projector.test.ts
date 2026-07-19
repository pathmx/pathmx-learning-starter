import { expect, it } from "bun:test"
import type { PathMXTrustedActor } from "@fellowhumans/pathmx"
import { projectLearningContext } from "../src/learning/context-projector"

function readingActor(
  read: PathMXTrustedActor["readSources"],
): PathMXTrustedActor {
  return {
    async play() {
      throw new Error("unused")
    },
    readSources: read,
    async act() {
      throw new Error("unused")
    },
  }
}

it("reads only the explicit unique Source set in caller order", async () => {
  let requested: readonly { sourceId: string }[] = []
  const actor = readingActor(async (sources) => {
    requested = sources
    return sources.map((source) => ({
      type: "source" as const,
      source,
      version: `version:${source.sourceId}`,
      contentType: "text/markdown",
      content: `# ${source.sourceId}`,
    }))
  })
  const projected = await projectLearningContext({
    actor,
    causeRunId: "run-1",
    responseHash: "response-1",
    questionId: "question-1",
    sourceIds: ["lesson", "coach.persona", "lesson"],
  })
  expect(requested).toEqual([
    { sourceId: "lesson" },
    { sourceId: "coach.persona" },
  ])
  expect(projected.sources.map((source) => source.sourceId)).toEqual([
    "lesson",
    "coach.persona",
  ])
})

it("rejects projected context above the aggregate byte ceiling", async () => {
  const actor = readingActor(async (sources) =>
    sources.map((source) => ({
      type: "source" as const,
      source,
      version: "large",
      contentType: "text/markdown",
      content: "x".repeat(65 * 1024),
    })),
  )
  await expect(
    projectLearningContext({
      actor,
      causeRunId: "run-large",
      responseHash: "response-large",
      questionId: "question-large",
      sourceIds: ["too-large"],
    }),
  ).rejects.toThrow("Learning context exceeds 65536 bytes")
})
