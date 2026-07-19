import {
  defineAction,
  type PathMXActionInput,
} from "@fellowhumans/pathmx/plugin"
import { currentQuestionResponseHash } from "./source-format"
import {
  findPathProposal,
  instantiateConfirmedPath,
} from "./path-instantiation"

type ConfirmPathInput = Record<string, never>

type ConfirmPathResult = {
  status: "created" | "existing"
  pathSourceId: string
  lessonSourceId: string
}

const PATH_TEMPLATE_SOURCE_ID = "library/templates/path.template"
const LESSON_TEMPLATE_SOURCE_ID = "library/templates/lesson.template"

function parseEmptyForm(input: PathMXActionInput) {
  if (input.type !== "form" || input.fields.length !== 0) {
    return {
      type: "invalid" as const,
      issues: [
        {
          code: "invalid-confirmation",
          message: "Path confirmation does not accept form fields.",
        },
      ],
    }
  }
  const value: ConfirmPathInput = {}
  return { type: "valid" as const, value, journalValue: value }
}

function validateResult(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    (value.status === "created" || value.status === "existing") &&
    "pathSourceId" in value &&
    typeof value.pathSourceId === "string" &&
    "lessonSourceId" in value &&
    typeof value.lessonSourceId === "string"
  ) {
    return { type: "valid" as const, value: value as ConfirmPathResult }
  }
  return { type: "invalid" as const, message: "Invalid Path confirmation result." }
}

const resultSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "pathSourceId", "lessonSourceId"],
  properties: {
    status: { enum: ["created", "existing"] },
    pathSourceId: { type: "string", minLength: 1 },
    lessonSourceId: { type: "string", minLength: 1 },
  },
}

function confirmedResult(proposal: {
  pathSourceId: string
  lessonSourceId: string
}, status: ConfirmPathResult["status"]): ConfirmPathResult {
  return {
    status,
    pathSourceId: proposal.pathSourceId,
    lessonSourceId: proposal.lessonSourceId,
  }
}

export const learningConfirmPathAction = defineAction<
  "block",
  ConfirmPathInput,
  ConfirmPathResult
>({
  id: "learning.confirmPath",
  version: "1",
  title: "Confirm Path",
  target: "block",
  input: {
    jsonSchema: { type: "object", additionalProperties: false },
    parse: parseEmptyForm,
  },
  result: { jsonSchema: resultSchema, validate: validateResult },
  capability: {
    operations: ["source.create", "source.replace"],
    targetScope: "actor-root",
    maxOperations: 3,
  },
  check(context) {
    if (context.actor.id === "coach") {
      return {
        type: "unavailable",
        code: "learner-required",
        message: "Only the learner may confirm a proposed Path.",
      }
    }
    if (context.target.source.id !== "new.path") {
      return {
        type: "unavailable",
        code: "path-proposal-required",
        message: "Path confirmation must target its onboarding proposal Block.",
      }
    }
    return findPathProposal(context.target.source, context.target.block)
      ? { type: "available" }
      : {
          type: "unavailable",
          code: "path-proposal-missing",
          message: "The proposed Path is no longer available.",
        }
  },
  async plan(context) {
    const proposal = findPathProposal(
      context.target.source,
      context.target.block,
    )
    if (!proposal) {
      return context.plan.conflict(
        "path-proposal-missing",
        "The proposed Path changed before confirmation.",
      )
    }
    if (proposal.status === "confirmed") {
      return context.plan.noop({
        code: "path-already-confirmed",
        message: "This Path proposal was already confirmed.",
        result: confirmedResult(proposal, "existing"),
      })
    }
    const responseHash = await currentQuestionResponseHash(
      context.target.source,
      proposal.questionId,
    )
    if (responseHash !== proposal.responseHash) {
      return context.plan.conflict(
        "stale-response",
        "The learner goal changed after this Path was proposed.",
      )
    }

    const [pathTemplate, lessonTemplate] = await Promise.all([
      context.sources.require(PATH_TEMPLATE_SOURCE_ID),
      context.sources.require(LESSON_TEMPLATE_SOURCE_ID),
    ])
    let instantiated: ReturnType<typeof instantiateConfirmedPath>
    try {
      instantiated = instantiateConfirmedPath({
        source: context.target.source,
        proposal,
        confirmationRunId: context.run.id,
      })
    } catch (error) {
      return context.plan.conflict(
        "path-instantiation-failed",
        error instanceof Error ? error.message : String(error),
      )
    }

    const pathSource = context.plan.copySource(
      pathTemplate,
      instantiated.pathSourcePath,
    )
    const lessonSource = context.plan.copySource(
      lessonTemplate,
      instantiated.lessonSourcePath,
    )
    const plannedBlocks = [
      [pathSource, instantiated.pathBlocks],
      [lessonSource, instantiated.lessonBlocks],
    ] as const
    for (const [source, replacements] of plannedBlocks) {
      for (const replacement of replacements) {
        const id = replacement.data?.id
        const block = source.blocks.find((candidate) => candidate.data.id === id)
        if (!block) {
          return context.plan.conflict(
            "path-template-invalid",
            `The maintained ${source.data.type} template is missing Block "${id}".`,
          )
        }
      }
    }
    for (const [source, type, template] of [
      [pathSource, "path", PATH_TEMPLATE_SOURCE_ID],
      [lessonSource, "lesson", LESSON_TEMPLATE_SOURCE_ID],
    ] as const) {
      context.plan.setSourceData(source, "type", type)
      context.plan.setSourceData(source, "status", "active")
      context.plan.setSourceData(source, "origin", {
        source: context.target.source.id,
        run: proposal.causeRunId,
        template,
      })
      context.plan.setSourceData(source, "actions", {
        "coach-begin": "learning.beginTurn",
        "coach-apply": "learning.applyTurn",
        "coach-fail": "learning.failTurn",
      })
    }
    for (const [source, replacements] of plannedBlocks) {
      for (const replacement of replacements) {
        const block = source.blocks.find(
          (candidate) => candidate.data.id === replacement.data?.id,
        )!
        context.plan.replaceBlock(block, replacement)
      }
    }
    context.plan.replaceBlock(proposal.block, instantiated.confirmedBlock)
    return context.plan.complete(confirmedResult(proposal, "created"))
  },
})
