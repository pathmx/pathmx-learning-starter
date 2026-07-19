import type { PathMXTrustedActor } from "@fellowhumans/pathmx"
import type { LearningContextSource, LearningTurnContext } from "./drivers"

const MAX_CONTEXT_BYTES = 64 * 1024

export async function projectLearningContext(options: {
  actor: PathMXTrustedActor
  causeRunId: string
  responseHash: string
  questionId: string
  sourceIds: readonly string[]
}): Promise<LearningTurnContext> {
  const unique = [...new Set(options.sourceIds)]
  const results = await options.actor.readSources(
    unique.map((sourceId) => ({ sourceId })),
  )
  const sources: LearningContextSource[] = []
  let bytes = 0
  for (let index = 0; index < unique.length; index++) {
    const result = results[index]
    if (!result || result.type !== "source") {
      throw new Error(
        `Required context Source "${unique[index]}" is unavailable.`,
      )
    }
    bytes += new TextEncoder().encode(result.content).byteLength
    if (bytes > MAX_CONTEXT_BYTES) {
      throw new Error(`Learning context exceeds ${MAX_CONTEXT_BYTES} bytes.`)
    }
    sources.push({
      sourceId: result.source.sourceId,
      version: result.version,
      content: result.content,
    })
  }
  return {
    causeRunId: options.causeRunId,
    responseHash: options.responseHash,
    questionId: options.questionId,
    sources,
  }
}
