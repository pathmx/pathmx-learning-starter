import {
  createSourceId,
  type PathMXAuthoredBlock,
  type Source,
  type SourceBlock,
} from "@fellowhumans/pathmx/plugin"
import {
  readAgentResponseBlocks,
  readQuestionResponse,
} from "./source-format"

const ONBOARDING_SOURCE_ID = "new.path"
const ONBOARDING_QUESTION_ID = "learning-goal"
const PATH_PROPOSAL_ID = "path-proposal"

export type PathProposalData = Readonly<{
  block: SourceBlock
  id: string
  status: "proposed" | "confirmed"
  causeRunId: string
  receiptId: string
  responseHash: string
  questionId: string
  pathSourceId: string
  pathHref: string
  lessonSourceId: string
  lessonHref: string
}>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function plainInline(value: string, fallback: string) {
  const collapsed = value
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .replaceAll("<", "‹")
    .replaceAll(">", "›")
    .trim()
  return (collapsed || fallback).slice(0, 160)
}

function markdownLabel(value: string, fallback: string) {
  return plainInline(value, fallback).replace(/([\\`*_{}\[\]()#+.!|])/g, "\\$1")
}

function slugForTopic(topic: string) {
  const slug = topic
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
  return slug || "learning-path"
}

export function pathDestinationsForTopic(topic: string) {
  const slug = slugForTopic(topic)
  const pathSourcePath = `learner-paths/${slug}/index.path.md`
  const lessonSourcePath =
    `learner-paths/${slug}/lessons/01-start/index.lesson.md`
  return {
    slug,
    pathSourcePath,
    pathSourceId: createSourceId(pathSourcePath),
    pathHref: `./${pathSourcePath}`,
    lessonSourcePath,
    lessonSourceId: createSourceId(lessonSourcePath),
    lessonHref: `./${lessonSourcePath}`,
  }
}

export function formatPathProposalBlock(options: {
  source: Source
  questionId: string
  causeRunId: string
  receiptId: string
  responseHash: string
}): PathMXAuthoredBlock | undefined {
  if (
    options.source.id !== ONBOARDING_SOURCE_ID ||
    options.questionId !== ONBOARDING_QUESTION_ID
  ) {
    return undefined
  }
  const response = readQuestionResponse(options.source, options.questionId)
  const topic = response?.topic
  if (!topic) return undefined
  const destination = pathDestinationsForTopic(topic)
  const pathTitle = markdownLabel(topic, "New Learning Path")
  return {
    data: {
      type: "path-proposal",
      id: PATH_PROPOSAL_ID,
      status: "proposed",
      causeRun: options.causeRunId,
      receipt: options.receiptId,
      question: options.questionId,
      responseHash: options.responseHash,
      path: {
        sourceId: destination.pathSourceId,
        href: destination.pathHref,
      },
      lesson: {
        sourceId: destination.lessonSourceId,
        href: destination.lessonHref,
      },
      actions: { confirm: "learning.confirmPath" },
    },
    markdown: [
      `## Ready to build a Path for ${pathTitle}?`,
      "",
      "When this direction feels right, choose **Confirm Path**. Your first",
      "readable Lesson will be ready immediately.",
      "",
      `- [Planned Path: ${pathTitle}](${destination.pathHref})`,
      `- [Planned first Lesson](${destination.lessonHref})`,
    ].join("\n"),
  }
}

function nestedSource(
  value: unknown,
): { sourceId: string; href: string } | undefined {
  if (
    !isRecord(value) ||
    typeof value.sourceId !== "string" ||
    typeof value.href !== "string"
  ) {
    return undefined
  }
  return { sourceId: value.sourceId, href: value.href }
}

export function findPathProposal(
  source: Source,
  targetBlock: SourceBlock,
): PathProposalData | undefined {
  if (targetBlock.sourceId !== source.id) return undefined
  const data = targetBlock.data
  const id = typeof data.id === "string" ? data.id : undefined
  const path = nestedSource(data.path)
  const lesson = nestedSource(data.lesson)
  if (
    data.type !== "path-proposal" ||
    !id ||
    !targetBlock.id.endsWith(`#${id}`) ||
    (data.status !== "proposed" && data.status !== "confirmed") ||
    typeof data.causeRun !== "string" ||
    typeof data.receipt !== "string" ||
    typeof data.responseHash !== "string" ||
    typeof data.question !== "string" ||
    !path ||
    !lesson
  ) {
    return undefined
  }
  return {
    block: targetBlock,
    id,
    status: data.status,
    causeRunId: data.causeRun,
    receiptId: data.receipt,
    responseHash: data.responseHash,
    questionId: data.question,
    pathSourceId: path.sourceId,
    pathHref: path.href,
    lessonSourceId: lesson.sourceId,
    lessonHref: lesson.href,
  }
}

export function findPathProposalBlock(source: Source) {
  return source.blocks.find(
    (block) =>
      block.data.type === "path-proposal" &&
      block.data.id === PATH_PROPOSAL_ID,
  )
}

function pathBlocks(options: {
  topic: string
  outcome: string
  blocks: readonly { title: string; markdown: string }[]
}): readonly PathMXAuthoredBlock[] {
  const topic = plainInline(options.topic, "a new subject")
  const title = `Learn ${markdownLabel(topic, "a new subject")}`
  const lessonTitle = plainInline(
    options.blocks[0]?.title ?? `Build a first model of ${topic}`,
    "Build the first working model",
  )
  const roadmap = [
    `1. [${markdownLabel(lessonTitle, "First Lesson")}](./lessons/01-start/index.lesson.md) — ready`,
    ...options.blocks.slice(1).map(
      (block, index) =>
        `${index + 2}. **${markdownLabel(block.title, `Lesson ${index + 2}`)}** — Lesson Draft`,
    ),
  ].join("\n")
  return [
    {
      data: { id: "intro" },
      markdown: [
        `# ${title}`,
        "",
        "This learner-owned Path keeps the confirmed outcome, the current Lesson, and",
        "a readable roadmap together.",
      ].join("\n"),
    },
    {
      data: { id: "outcome" },
      markdown: [
        "## Outcome",
        "",
        plainInline(
          options.outcome,
          `Build a useful working understanding of ${topic}.`,
        ),
      ].join("\n"),
    },
    {
      data: { id: "roadmap" },
      markdown: ["## Roadmap", "", roadmap].join("\n"),
    },
  ]
}

function lessonBlocks(options: {
  topic: string
  outcome: string
  blocks: readonly { title: string; markdown: string }[]
}): readonly PathMXAuthoredBlock[] {
  const topic = plainInline(options.topic, "this subject")
  const first = options.blocks[0]
  const lessonTitle = plainInline(
    first?.title ?? `Build a first model of ${topic}`,
    "Build the first working model",
  )
  const opening = options.blocks[1]?.markdown ||
    `Begin by separating the first useful distinction in ${topic} from a nearby misconception.`
  return [
    {
      data: { id: "intro" },
      markdown: [
        `# ${markdownLabel(lessonTitle, "First Lesson")}`,
        "",
        `This first Lesson on ${topic} is readable before any new coach turn begins.`,
      ].join("\n"),
    },
    {
      data: { id: "outcome" },
      markdown: [
        "## Outcome",
        "",
        first?.markdown ||
          plainInline(options.outcome, `Build a working model of ${topic}.`),
      ].join("\n"),
    },
    {
      data: { id: "opening" },
      markdown: ["## Begin", "", opening].join("\n"),
    },
    {
      data: {
        type: "question",
        id: "first-evidence",
        question: { type: "long" },
        actions: { submit: "questions.submitText" },
      },
      markdown: [
        `## How would you explain ${markdownLabel(topic, "this subject")} right now?`,
        "",
        `Explain ${topic} in your own words. Include the part you feel least certain about.`,
      ].join("\n"),
    },
  ]
}

function confirmedProposalBlock(options: {
  proposal: PathProposalData
  confirmationRunId: string
  topic: string
  lessonTitle: string
}): PathMXAuthoredBlock {
  const pathTitle = markdownLabel(options.topic, "New Learning Path")
  const lessonTitle = markdownLabel(options.lessonTitle, "First Lesson")
  return {
    data: {
      type: "path-proposal",
      id: options.proposal.id,
      status: "confirmed",
      causeRun: options.proposal.causeRunId,
      receipt: options.proposal.receiptId,
      question: options.proposal.questionId,
      responseHash: options.proposal.responseHash,
      confirmationRun: options.confirmationRunId,
      path: {
        sourceId: options.proposal.pathSourceId,
        href: options.proposal.pathHref,
      },
      lesson: {
        sourceId: options.proposal.lessonSourceId,
        href: options.proposal.lessonHref,
      },
      actions: { confirm: "learning.confirmPath" },
    },
    markdown: [
      "## Your learning Path is ready",
      "",
      `- [Open the Path: ${pathTitle}](${options.proposal.pathHref})`,
      `- [Start the first Lesson: ${lessonTitle}](${options.proposal.lessonHref})`,
    ].join("\n"),
  }
}

export function instantiateConfirmedPath(options: {
  source: Source
  proposal: PathProposalData
  confirmationRunId: string
}) {
  const response = readQuestionResponse(options.source, options.proposal.questionId)
  const topic = response?.topic
  const outcome = response?.outcome
  if (!topic || !outcome) {
    throw new Error("The onboarding Response is incomplete.")
  }
  const expected = pathDestinationsForTopic(topic)
  if (
    options.proposal.pathSourceId !== expected.pathSourceId ||
    options.proposal.pathHref !== expected.pathHref ||
    options.proposal.lessonSourceId !== expected.lessonSourceId ||
    options.proposal.lessonHref !== expected.lessonHref
  ) {
    throw new Error("The proposed Path destination no longer matches the learner goal.")
  }
  const blocks = readAgentResponseBlocks(
    options.source,
    options.proposal.causeRunId,
  )
  if (blocks.length === 0) {
    throw new Error("The confirmed proposal has no coach Blocks.")
  }
  return {
    topic,
    pathSourceId: expected.pathSourceId,
    pathSourcePath: expected.pathSourcePath,
    pathBlocks: pathBlocks({
      topic,
      outcome,
      blocks,
    }),
    lessonSourceId: expected.lessonSourceId,
    lessonSourcePath: expected.lessonSourcePath,
    lessonBlocks: lessonBlocks({
      topic,
      outcome,
      blocks,
    }),
    confirmedBlock: confirmedProposalBlock({
      proposal: options.proposal,
      confirmationRunId: options.confirmationRunId,
      topic,
      lessonTitle: blocks[0]?.title ?? "First Lesson",
    }),
  }
}
