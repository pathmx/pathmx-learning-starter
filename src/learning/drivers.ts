import type { LearningTurnProposal } from "./proposals"

export type LearningContextSource = Readonly<{
  sourceId: string
  version: string
  content: string
}>

export type LearningTurnContext = Readonly<{
  causeRunId: string
  responseHash: string
  questionId: string
  sources: readonly LearningContextSource[]
}>

export type AgentDriver = Readonly<{
  propose(
    context: LearningTurnContext,
    signal: AbortSignal,
  ): Promise<LearningTurnProposal>
}>

function fieldValue(source: string, field: string) {
  const response = source.match(/\nresponse:\n((?: {2}.+\n?)+)/)?.[1] ?? ""
  const match = response.match(new RegExp(`^  ${field}:\\s*(.+)$`, "m"))
  return match?.[1]?.replace(/^['"]|['"]$/g, "").trim()
}

export function createFakeAgentDriver(options: {
  wait?: Promise<void>
} = {}): AgentDriver {
  return {
    async propose(context, signal) {
      await options.wait
      if (signal.aborted) throw signal.reason
      const currentSource = context.sources[0]?.content
      const topic = currentSource ? fieldValue(currentSource, "topic") : undefined
      const outcome = currentSource ? fieldValue(currentSource, "outcome") : undefined
      const subject = topic || "your learning goal"
      return {
        type: "learning-turn",
        blocks: [
          {
            id: "proposed-outcome",
            title: `A practical outcome for ${subject}`,
            markdown:
              outcome ||
              `Build a clear working understanding of ${subject} and use it in one concrete situation.`,
          },
          {
            id: "short-roadmap",
            title: "A short path forward",
            markdown: [
              "1. Surface what you already know and the first useful distinction.",
              "2. Practice that distinction with immediate evidence.",
              "3. Apply it in a small realistic situation and reflect on what changed.",
            ].join("\n"),
          },
        ],
      }
    },
  }
}
