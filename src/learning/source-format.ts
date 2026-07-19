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
  status: "pending" | "complete" | "failed"
  causeRunId: string
  expectedResponseHash: string
  attempt: number
  message?: string
}): PathMXAuthoredBlock {
  const heading =
    options.status === "pending"
      ? "Coach is preparing your next move…"
      : options.status === "complete"
        ? "Coach prepared the next move"
        : "Coach could not finish this turn"
  const body =
    options.status === "pending"
      ? "Your response is saved. This receipt remains here if the process stops."
      : options.status === "complete"
        ? "The generated Blocks below were applied through the recorded coach Action."
        : `${failureMessage(options.message) || "The turn failed."} You can retry without losing your response.`
  return {
    data: {
      type: "agent-turn",
      id: options.receiptId,
      status: options.status,
      causeRun: options.causeRunId,
      expectedResponse: options.expectedResponseHash,
      actor: "coach",
      attempt: options.attempt,
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

export function completedReceiptBlock(options: {
  receipt: SourceBlock
  receiptId: string
  causeRunId: string
  expectedResponseHash: string
}) {
  return receiptBlock({
    receiptId: options.receiptId,
    status: "complete",
    causeRunId: options.causeRunId,
    expectedResponseHash: options.expectedResponseHash,
    attempt: receiptAttempt(options.receipt),
  })
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

export function agentResponseBlocks(options: {
  receiptId: string
  causeRunId: string
  proposal: LearningTurnProposal
}): PathMXAuthoredBlock[] {
  return options.proposal.blocks.map((block, index) => ({
    data: {
      type: "agent-response",
      id: `${options.receiptId}-${index + 1}-${block.id}`,
      agent: { actor: "coach", causedBy: options.causeRunId },
    },
    markdown: `## ${block.title}\n\n${block.markdown}`,
  }))
}

export async function questionResponseHash(response: Record<string, string>) {
  const canonical = Object.fromEntries(
    Object.entries(response).sort(([left], [right]) => left.localeCompare(right)),
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
  return Object.keys(response).length === Object.keys(question.data.response).length
    ? response
    : undefined
}

export function readAgentResponseBlocks(source: Source, causeRunId: string) {
  return source.blocks.flatMap((block) => {
    const agent = isRecord(block.data.agent) ? block.data.agent : undefined
    if (
      block.data.type !== "agent-response" ||
      agent?.causedBy !== causeRunId
    ) {
      return []
    }
    const body = block.markdown.trim()
    const heading = body.match(/^## ([^\n]+)\n*/)
    if (!heading?.[1]) return []
    return [
      {
        id: String(block.data.id),
        title: heading[1].trim(),
        markdown: body.slice(heading[0].length).trim(),
      },
    ]
  })
}
