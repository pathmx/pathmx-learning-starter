import type {
  LearningTurnDraft,
  LearningTurnTemplate,
} from "./proposals"

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

export type AgentDriver<Draft extends LearningTurnDraft = LearningTurnDraft> =
  Readonly<{
    propose(
      context: LearningTurnContext,
      signal: AbortSignal,
    ): Promise<Draft>
  }>

export function createFakeAgentDriver(
  options: {
    wait?: Promise<void>
  } = {},
): AgentDriver<LearningTurnTemplate> {
  return {
    async propose(_context, signal) {
      await options.wait
      if (signal.aborted) throw signal.reason
      return {
        type: "learning-template",
        template: "starting-path",
      }
    },
  }
}
