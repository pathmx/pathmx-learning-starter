import {
  defineAction,
  type PathMXActionInput,
} from "@fellowhumans/pathmx/plugin"
import {
  agentResponseBlocks,
  completedReceiptBlock,
  currentQuestionResponseHash,
  failedReceiptBlock,
  findPendingTurn,
  findTurnReceipt,
  pendingReceiptBlock,
} from "./source-format"
import {
  findPathProposalBlock,
  formatPathProposalBlock,
} from "./path-instantiation"
import { parseLearningTurnProposal } from "./proposals"

type BeginTurnInput = {
  causeRunId: string
  expectedResponseHash: string
  questionId: string
  receiptId: string
}

type ApplyTurnInput = BeginTurnInput & {
  proposal: ReturnType<typeof parseLearningTurnProposal>
}

type FailTurnInput = BeginTurnInput & {
  message: string
}

type TurnResult = {
  receiptId: string
  status: "pending" | "complete" | "failed" | "existing"
}

function parsedForm(
  input: PathMXActionInput,
  names: readonly string[],
): Record<string, string> | undefined {
  if (input.type !== "form" || input.fields.length !== names.length) {
    return undefined
  }
  const allowed = new Set(names)
  const result: Record<string, string> = {}
  for (const field of input.fields) {
    if (!allowed.has(field.name) || Object.hasOwn(result, field.name)) {
      return undefined
    }
    result[field.name] = field.value
  }
  return names.every((name) => result[name]) ? result : undefined
}

function invalid(message: string) {
  return {
    type: "invalid" as const,
    issues: [{ code: "invalid-learning-turn", message }],
  }
}

function validateTurnResult(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "receiptId" in value &&
    typeof value.receiptId === "string" &&
    "status" in value &&
    ["pending", "complete", "failed", "existing"].includes(
      String(value.status),
    )
  ) {
    return { type: "valid" as const, value: value as TurnResult }
  }
  return { type: "invalid" as const, message: "Invalid learning turn result." }
}

const turnResultSchema = {
  type: "object",
  additionalProperties: false,
  required: ["receiptId", "status"],
  properties: {
    receiptId: { type: "string", minLength: 1 },
    status: {
      enum: ["pending", "complete", "failed", "existing"],
    },
  },
}

function coachOnly(context: { actor: { id: string } }) {
  return context.actor.id === "coach"
    ? { type: "available" as const }
    : {
        type: "unavailable" as const,
        code: "coach-required",
        message: "This learning Action belongs to the trusted coach Actor.",
      }
}

function baseTurnFields(values: Record<string, string>) {
  return {
    causeRunId: values.causeRunId!,
    expectedResponseHash: values.expectedResponseHash!,
    questionId: values.questionId!,
    receiptId: values.receiptId!,
  }
}

export const learningBeginTurnAction = defineAction<
  "source",
  BeginTurnInput,
  TurnResult
>({
  id: "learning.beginTurn",
  version: "1",
  title: "Begin learning turn",
  target: "source",
  input: {
    jsonSchema: { type: "object" },
    parse(input) {
      const values = parsedForm(input, [
        "causeRunId",
        "expectedResponseHash",
        "questionId",
        "receiptId",
      ])
      if (!values) return invalid("Begin turn fields are invalid.")
      const value = baseTurnFields(values)
      return { type: "valid", value, journalValue: value }
    },
  },
  result: { jsonSchema: turnResultSchema, validate: validateTurnResult },
  capability: {
    operations: ["source.replace"],
    targetScope: "attached-source",
    maxOperations: 1,
  },
  check: coachOnly,
  plan(context, input) {
    const source = context.target.source
    if (findTurnReceipt(source, input.receiptId)) {
      return context.plan.noop({
        code: "turn-exists",
        message: "This causal learner Run already owns a turn receipt.",
        result: { receiptId: input.receiptId, status: "existing" },
      })
    }
    if (findPendingTurn(source)) {
      return context.plan.conflict(
        "turn-pending",
        "This Source already has a pending coach turn.",
      )
    }
    const pending = pendingReceiptBlock({
      causeRunId: input.causeRunId,
      expectedResponseHash: input.expectedResponseHash,
    })
    if (pending.receiptId !== input.receiptId) {
      return context.plan.conflict(
        "receipt-id-mismatch",
        "The receipt identity does not match the causal Run.",
      )
    }
    context.plan.appendBlocks(source, [pending.block])
    return context.plan.complete({
      receiptId: input.receiptId,
      status: "pending",
    })
  },
})

export const learningApplyTurnAction = defineAction<
  "source",
  ApplyTurnInput,
  TurnResult
>({
  id: "learning.applyTurn",
  version: "1",
  title: "Apply learning turn",
  target: "source",
  input: {
    jsonSchema: { type: "object" },
    parse(input) {
      const values = parsedForm(input, [
        "causeRunId",
        "expectedResponseHash",
        "questionId",
        "receiptId",
        "proposal",
      ])
      if (!values) return invalid("Apply turn fields are invalid.")
      try {
        const proposal = parseLearningTurnProposal(JSON.parse(values.proposal!))
        const value = { ...baseTurnFields(values), proposal }
        return {
          type: "valid",
          value,
          journalValue: {
            ...baseTurnFields(values),
            blockCount: proposal.blocks.length,
          },
        }
      } catch (error) {
        return invalid(error instanceof Error ? error.message : String(error))
      }
    },
  },
  result: { jsonSchema: turnResultSchema, validate: validateTurnResult },
  capability: {
    operations: ["source.replace"],
    targetScope: "attached-source",
    maxOperations: 1,
  },
  check: coachOnly,
  async plan(context, input) {
    const source = context.target.source
    const receipt = findTurnReceipt(source, input.receiptId)
    if (!receipt || receipt.data.status !== "pending") {
      return context.plan.conflict(
        "turn-not-pending",
        "The matching turn receipt is not pending.",
      )
    }
    const currentHash = await currentQuestionResponseHash(
      source,
      input.questionId,
    )
    if (currentHash !== input.expectedResponseHash) {
      return context.plan.conflict(
        "stale-response",
        "The learner Response changed while Coach was working.",
      )
    }

    context.plan.replaceBlock(
      receipt,
      completedReceiptBlock({
        receipt,
        receiptId: input.receiptId,
        causeRunId: input.causeRunId,
        expectedResponseHash: input.expectedResponseHash,
      }),
    )
    context.plan.insertBlocksAfter(
      receipt,
      agentResponseBlocks({
        receiptId: input.receiptId,
        causeRunId: input.causeRunId,
        proposal: input.proposal,
      }),
    )

    const proposal = formatPathProposalBlock({
      source,
      questionId: input.questionId,
      causeRunId: input.causeRunId,
      receiptId: input.receiptId,
      responseHash: input.expectedResponseHash,
    })
    if (proposal) {
      const existing = findPathProposalBlock(source)
      if (!existing) {
        return context.plan.conflict(
          "path-proposal-missing",
          "The maintained onboarding proposal Block is missing.",
        )
      }
      context.plan.replaceBlock(existing, proposal)
    }
    return context.plan.complete({
      receiptId: input.receiptId,
      status: "complete",
    })
  },
})

export const learningFailTurnAction = defineAction<
  "source",
  FailTurnInput,
  TurnResult
>({
  id: "learning.failTurn",
  version: "1",
  title: "Fail learning turn",
  target: "source",
  input: {
    jsonSchema: { type: "object" },
    parse(input) {
      const values = parsedForm(input, [
        "causeRunId",
        "expectedResponseHash",
        "questionId",
        "receiptId",
        "message",
      ])
      if (!values) return invalid("Fail turn fields are invalid.")
      const value = { ...baseTurnFields(values), message: values.message! }
      return { type: "valid", value, journalValue: value }
    },
  },
  result: { jsonSchema: turnResultSchema, validate: validateTurnResult },
  capability: {
    operations: ["source.replace"],
    targetScope: "attached-source",
    maxOperations: 1,
  },
  check: coachOnly,
  plan(context, input) {
    const receipt = findTurnReceipt(context.target.source, input.receiptId)
    if (!receipt || receipt.data.status !== "pending") {
      return context.plan.noop({
        code: "turn-not-pending",
        message: "The matching turn receipt is no longer pending.",
        result: { receiptId: input.receiptId, status: "existing" },
      })
    }
    context.plan.replaceBlock(
      receipt,
      failedReceiptBlock({
        receipt,
        receiptId: input.receiptId,
        causeRunId: input.causeRunId,
        expectedResponseHash: input.expectedResponseHash,
        message: input.message,
      }),
    )
    return context.plan.complete({
      receiptId: input.receiptId,
      status: "failed",
    })
  },
})
