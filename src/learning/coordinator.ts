import type {
  PathMXFinalizedActionEvent,
  PathMXTrustedActor,
  PathMXTrustedActorModule,
} from "@fellowhumans/pathmx"
import type { PathMXPlaySessionRef } from "@fellowhumans/pathmx/actor"
import { projectLearningContext } from "./context-projector"
import type { AgentDriver } from "./drivers"
import { questionResponseHash, receiptIdForRun } from "./source-format"

const LEARNER_ACTIONS = new Set([
  "questions.submitFields",
  "questions.submitSingleChoice",
  "questions.submitText",
])
const SHARED_CONTEXT_SOURCES = [
  "learner.profile",
  "coach.persona",
  "library/component-catalog.guide",
  "assets/learning.components",
] as const

function resultRecord(event: PathMXFinalizedActionEvent) {
  const result = event.actionRun.finished.outcome.result
  return typeof result === "object" && result !== null && !Array.isArray(result)
    ? result
    : undefined
}

async function eventResponseHash(
  action: string,
  result: Record<string, unknown>,
) {
  if (typeof result.responseHash === "string") return result.responseHash
  if (
    action === "questions.submitSingleChoice" &&
    typeof result.answer === "string"
  ) {
    return questionResponseHash({ choice: result.answer })
  }
  return undefined
}

function actionFields(values: Record<string, string>) {
  return Object.entries(values).map(([name, value]) => ({ name, value }))
}

function finalizedStatus(result: Awaited<ReturnType<PathMXTrustedActor["act"]>>) {
  if (result.type !== "admitted") {
    throw new Error(`Coach Action was rejected: ${result.message}`)
  }
  const outcome = result.run.finished?.outcome
  if (!outcome) throw new Error("Coach Action did not finish.")
  if (outcome.type === "finalized" || outcome.type === "noop") return outcome
  throw new Error(`Coach Action ${outcome.type}: ${outcome.message}`)
}

async function playSessionFor(
  actor: PathMXTrustedActor,
  existing: Promise<PathMXPlaySessionRef> | undefined,
  sourceId: string,
) {
  if (existing) return existing
  const playing = await actor.play({ origin: { sourceId } })
  if (playing.type !== "playing") {
    throw new Error(`Coach Play Session failed: ${playing.message}`)
  }
  return playing.playSession
}

export function createLearningCoordinator(options: {
  driver: AgentDriver
}): PathMXTrustedActorModule {
  let playSession: Promise<PathMXPlaySessionRef> | undefined

  return {
    type: "pathmx/server-module",
    name: "pathmx/learning-coordinator",
    actor: { id: "coach", persona: { sourceId: "coach.persona" } },
    async actionFinalized(context, event) {
      if (
        event.actionRun.started.actor.id === "coach" ||
        !LEARNER_ACTIONS.has(event.actionRun.started.action.action) ||
        event.actionRun.finished.outcome.sourceChange.changedSources.length === 0
      ) {
        return
      }
      const result = resultRecord(event)
      const questionId = result?.questionId
      if (!result || typeof questionId !== "string") {
        return
      }
      const responseHash = await eventResponseHash(
        event.actionRun.started.action.action,
        result,
      )
      if (!responseHash) return
      const causeRunId = event.actionRun.started.run.id
      const sourceId = event.actionRun.started.source.sourceId
      const receiptId = receiptIdForRun(causeRunId)
      playSession ??= playSessionFor(context.actor, playSession, sourceId)
      const session = await playSession
      const base = {
        causeRunId,
        expectedResponseHash: responseHash,
        questionId,
        receiptId,
      }
      const begin = await context.actor.act({
        invocationId: `learning-begin:${causeRunId}`,
        playSession: session,
        source: { sourceId },
        mapping: { type: "source", localName: "coach-begin" },
        fields: actionFields(base),
      })
      const began = finalizedStatus(begin)
      if (began.type === "noop") return

      try {
        const projected = await projectLearningContext({
          actor: context.actor,
          causeRunId,
          responseHash,
          questionId,
          sourceIds: [sourceId, ...SHARED_CONTEXT_SOURCES],
        })
        const proposal = await options.driver.propose(projected, context.signal)
        const applied = await context.actor.act({
          invocationId: `learning-apply:${causeRunId}`,
          playSession: session,
          source: { sourceId },
          mapping: { type: "source", localName: "coach-apply" },
          fields: actionFields({
            ...base,
            proposal: JSON.stringify(proposal),
          }),
        })
        finalizedStatus(applied)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        const failed = await context.actor.act({
          invocationId: `learning-fail:${causeRunId}`,
          playSession: session,
          source: { sourceId },
          mapping: { type: "source", localName: "coach-fail" },
          fields: actionFields({ ...base, message }),
        })
        finalizedStatus(failed)
      }
    },
  }
}
