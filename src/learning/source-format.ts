import type {
  PathMXAuthoredBlock,
  Source,
  SourceBlock,
} from "@fellowhumans/pathmx/plugin"
import type { LearningTurnProposal } from "./proposals"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function turnId(causeRunId: string) {
  const safe = causeRunId.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return `coach-turn-${safe.replace(/^-|-$/g, "").slice(0, 48) || "run"}`
}

export function receiptIdForRun(causeRunId: string) {
  return turnId(causeRunId)
}

export function findTurnReceipt(source: Source, receiptId: string) {
  return source.blocks.find((block) => block.data.id === receiptId)
}

export function findPendingTurn(source: Source) {
  return source.blocks.find(
    (block) =>
      block.data.type === "agent-turn" && block.data.status === "pending",
  )
}

function failureMessage(message: string | undefined) {
  return message
    ?.replace(/[\t\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .replaceAll("<", "‹")
    .replaceAll(">", "›")
    .trim()
    .slice(0, 240)
}

function receiptBlock(options: {
  receiptId: string
  status: "pending" | "failed"
  causeRunId: string
  expectedResponseHash: string
  attempt: number
  message?: string
}): PathMXAuthoredBlock {
  const heading =
    options.status === "pending"
      ? "Building your starting path…"
      : "We could not build the path yet"
  const body =
    options.status === "pending"
      ? "Your goal is saved. We are shaping a useful first outcome and a few steps that fit the time you have."
      : "Your goal is saved. Try again when you are ready."
  const error =
    options.status === "failed" ? failureMessage(options.message) : undefined
  return {
    data: {
      type: "agent-turn",
      id: options.receiptId,
      status: options.status,
      causeRun: options.causeRunId,
      expectedResponse: options.expectedResponseHash,
      actor: "coach",
      attempt: options.attempt,
      ...(error ? { error } : {}),
    },
    markdown: `## ${heading}\n\n${body}`,
  }
}

export function pendingReceiptBlock(options: {
  causeRunId: string
  expectedResponseHash: string
  attempt?: number
}) {
  const receiptId = receiptIdForRun(options.causeRunId)
  return {
    receiptId,
    block: receiptBlock({
      receiptId,
      status: "pending",
      causeRunId: options.causeRunId,
      expectedResponseHash: options.expectedResponseHash,
      attempt: options.attempt ?? 1,
    }),
  }
}

function receiptAttempt(receipt: SourceBlock) {
  return typeof receipt.data.attempt === "number" ? receipt.data.attempt : 1
}

function proposalMarkdown(block: LearningTurnProposal["blocks"][number]) {
  return `## ${block.title}\n\n${block.markdown}`
}

export function completedTurnBlocks(options: {
  receipt: SourceBlock
  receiptId: string
  causeRunId: string
  expectedResponseHash: string
  proposal: LearningTurnProposal
}) {
  const [first, ...remaining] = options.proposal.blocks
  if (!first) {
    throw new Error("A completed learning turn requires a proposal Block.")
  }
  return {
    primary: {
      data: {
        type: "agent-turn",
        id: options.receiptId,
        status: "complete",
        causeRun: options.causeRunId,
        expectedResponse: options.expectedResponseHash,
        actor: "coach",
        attempt: receiptAttempt(options.receipt),
        proposal: first.id,
      },
      markdown: proposalMarkdown(first),
    } satisfies PathMXAuthoredBlock,
    additional: remaining.map((block, index) => ({
      data: {
        type: "agent-response",
        id: `${options.receiptId}-${index + 2}-${block.id}`,
        agent: { actor: "coach", causedBy: options.causeRunId },
      },
      markdown: proposalMarkdown(block),
    })) satisfies PathMXAuthoredBlock[],
  }
}

export function failedReceiptBlock(options: {
  receipt: SourceBlock
  receiptId: string
  causeRunId: string
  expectedResponseHash: string
  message: string
}) {
  return receiptBlock({
    receiptId: options.receiptId,
    status: "failed",
    causeRunId: options.causeRunId,
    expectedResponseHash: options.expectedResponseHash,
    attempt: receiptAttempt(options.receipt),
    message: options.message,
  })
}

export async function questionResponseHash(response: Record<string, string>) {
  const canonical = Object.fromEntries(
    Object.entries(response).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  )
  const bytes = new TextEncoder().encode(JSON.stringify(canonical))
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  const digest = await crypto.subtle.digest("SHA-256", buffer)
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export async function currentQuestionResponseHash(
  source: Source,
  questionId: string,
) {
  const response = readQuestionResponse(source, questionId)
  return response ? questionResponseHash(response) : undefined
}

export function readQuestionResponse(source: Source, questionId: string) {
  const question = source.blocks.find(
    (block) => block.data.type === "question" && block.data.id === questionId,
  )
  if (!question || !isRecord(question.data.response)) return undefined
  const response = Object.fromEntries(
    Object.entries(question.data.response).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  )
  return Object.keys(response).length ===
    Object.keys(question.data.response).length
    ? response
    : undefined
}
