import type {
  LearningTurnDraft,
  LearningTurnProposal,
} from "./proposals"

const STARTING_PATH_FIELDS = [
  "topic",
  "outcome",
  "starting-point",
  "time",
] as const

function markdownText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/([\\`*_[\]])/g, "\\$1")
    .replace(/^([#+-])/, "\\$1")
    .replace(/^(\d+)\./, "$1\\.")
}

function startingPathResponse(response: Record<string, string>) {
  const missing = STARTING_PATH_FIELDS.find((field) => !response[field]?.trim())
  if (missing) {
    throw new Error(`The starting path requires Response Field "${missing}".`)
  }
  return {
    topic: markdownText(response.topic!.trim()),
    outcome: markdownText(response.outcome!.trim()),
    startingPoint: markdownText(response["starting-point"]!.trim()),
    time: markdownText(response.time!.trim()),
  }
}

export function resolveLearningTurnDraft(
  draft: LearningTurnDraft,
  response: Record<string, string>,
): LearningTurnProposal {
  if (draft.type === "learning-turn") return draft
  const values = startingPathResponse(response)
  return {
    type: "learning-turn",
    blocks: [
      {
        id: "starting-path",
        title: "Your starting path",
        markdown: [
          `**Focus:** ${values.topic}`,
          "",
          `**What success looks like:** ${values.outcome}`,
          "",
          `**Starting from:** ${values.startingPoint}`,
          "",
          `### A route that fits ${values.time}`,
          "",
          "1. Map what you already know and identify the first useful gap.",
          "2. Build a simple model for the topic and test it with one concrete example.",
          "3. Practice the outcome above, then note what to strengthen next.",
        ].join("\n"),
      },
    ],
  }
}
