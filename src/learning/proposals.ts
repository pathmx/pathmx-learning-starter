export type LearningBlockProposal = {
  id: string
  title: string
  markdown: string
}

export type LearningTurnProposal = {
  type: "learning-turn"
  blocks: LearningBlockProposal[]
}

const LOCAL_ID = /^[a-z][a-z0-9-]{0,79}$/
const MAX_BLOCKS = 3
const MAX_TITLE = 120
const MAX_MARKDOWN = 8 * 1024
const MAX_TOTAL = 24 * 1024

function containsSourceStructure(value: string) {
  return /<!--|-->/.test(value) || /^---[ \t]*$/m.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function parseLearningTurnProposal(
  value: unknown,
): LearningTurnProposal {
  if (!isRecord(value) || value.type !== "learning-turn") {
    throw new Error('Learning proposal type must be "learning-turn".')
  }
  if (
    !Array.isArray(value.blocks) ||
    value.blocks.length === 0 ||
    value.blocks.length > MAX_BLOCKS
  ) {
    throw new Error(`Learning proposal must contain 1–${MAX_BLOCKS} Blocks.`)
  }
  const ids = new Set<string>()
  const blocks = value.blocks.map((candidate) => {
    if (!isRecord(candidate)) throw new Error("Learning Block is invalid.")
    const { id, title, markdown } = candidate
    if (typeof id !== "string" || !LOCAL_ID.test(id) || ids.has(id)) {
      throw new Error("Learning Block IDs must be unique local identifiers.")
    }
    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > MAX_TITLE ||
      title.includes("\n") ||
      containsSourceStructure(title)
    ) {
      throw new Error(`Learning Block title exceeds ${MAX_TITLE} characters.`)
    }
    if (
      typeof markdown !== "string" ||
      !markdown.trim() ||
      containsSourceStructure(markdown) ||
      new TextEncoder().encode(markdown).byteLength > MAX_MARKDOWN
    ) {
      throw new Error(
        "Learning Block Markdown is empty, too large, or contains Source structure.",
      )
    }
    ids.add(id)
    return { id, title: title.trim(), markdown: markdown.trim() }
  })
  if (new TextEncoder().encode(JSON.stringify(blocks)).byteLength > MAX_TOTAL) {
    throw new Error(`Learning proposal exceeds ${MAX_TOTAL} UTF-8 bytes.`)
  }
  return { type: "learning-turn", blocks }
}

export const learningTurnProposalJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["type", "blocks"],
  properties: {
    type: { type: "string", const: "learning-turn" },
    blocks: {
      type: "array",
      minItems: 1,
      maxItems: MAX_BLOCKS,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "markdown"],
        properties: {
          id: { type: "string", pattern: "^[a-z][a-z0-9-]{0,79}$" },
          title: { type: "string", minLength: 1, maxLength: MAX_TITLE },
          markdown: { type: "string", minLength: 1, maxLength: MAX_MARKDOWN },
        },
      },
    },
  },
} as const
