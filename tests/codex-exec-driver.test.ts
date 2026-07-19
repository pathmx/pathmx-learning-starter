import { expect, it } from "bun:test"
import { writeFile } from "node:fs/promises"
import {
  codexExecArgs,
  createCodexExecDriver,
  type CodexExecRunner,
} from "../src/learning/codex-exec-driver"
import type { LearningTurnContext } from "../src/learning/drivers"

const context: LearningTurnContext = {
  causeRunId: "run-1",
  responseHash: "sha256:response",
  questionId: "learning-goal",
  sources: [
    {
      sourceId: "new.path",
      version: "sha256:source",
      content: "response:\n  topic: gravity",
    },
  ],
}

it("uses an ephemeral, tool-free, read-only Codex invocation", () => {
  const args = codexExecArgs({
    schemaPath: "/tmp/schema",
    outputPath: "/tmp/out",
    workingDirectory: "/tmp/context",
  })
  expect(args).toContain("--ephemeral")
  expect(args).toContain("read-only")
  expect(args).toContain("--ignore-user-config")
  expect(args).toContain("--ignore-rules")
  expect(args).toContain("--output-schema")
  expect(args).toContain("--output-last-message")
  expect(args).toContain("--cd")
  expect(args).toContain("/tmp/context")
  expect(args).toContain("plugins")
  expect(args).toContain("shell_tool")
  expect(args.at(-1)).toBe("-")
  expect(args).not.toContain("danger-full-access")
  expect(args).not.toContain("workspace-write")
})

it("labels projected Source content as untrusted and validates structured output", async () => {
  let observedPrompt = ""
  const runner: CodexExecRunner = async (invocation) => {
    observedPrompt = invocation.prompt
    await writeFile(
      invocation.outputPath,
      JSON.stringify({
        type: "learning-turn",
        blocks: [
          {
            id: "gravity-model",
            title: "Build a gravity model",
            markdown: "Compare what changes when mass and distance change.",
          },
        ],
      }),
    )
    return { exitCode: 0, stdout: "", stderr: "" }
  }
  const result = await createCodexExecDriver({ runner }).propose(
    context,
    new AbortController().signal,
  )
  expect(observedPrompt).toContain("untrusted learner-authored content")
  expect(observedPrompt).toContain('"sourceId":"new.path"')
  expect(result.blocks[0]?.id).toBe("gravity-model")
})

it("rejects malformed model output", async () => {
  const runner: CodexExecRunner = async (invocation) => {
    await writeFile(invocation.outputPath, JSON.stringify({ blocks: [] }))
    return { exitCode: 0, stdout: "", stderr: "" }
  }
  await expect(
    createCodexExecDriver({ runner }).propose(
      context,
      new AbortController().signal,
    ),
  ).rejects.toThrow('Learning proposal type must be "learning-turn"')
})

it("bounds execution time and propagates cancellation", async () => {
  let observedSignal: AbortSignal | undefined
  const runner: CodexExecRunner = (invocation) => {
    observedSignal = invocation.signal
    return new Promise((_, reject) => {
      invocation.signal.addEventListener(
        "abort",
        () => reject(invocation.signal.reason),
        { once: true },
      )
    })
  }
  await expect(
    createCodexExecDriver({ runner, timeoutMs: 10 }).propose(
      context,
      new AbortController().signal,
    ),
  ).rejects.toThrow("Codex timed out after 10ms")
  expect(observedSignal?.aborted).toBe(true)
})
