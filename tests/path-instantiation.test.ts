import { expect, it } from "bun:test"
import { createSourceId } from "@fellowhumans/pathmx/plugin"
import { pathDestinationsForTopic } from "../src/learning/path-instantiation"

it("creates deterministic canonical Path and Lesson destinations", () => {
  const destination = pathDestinationsForTopic("The Greenhouse Effect")
  expect(destination).toEqual({
    slug: "the-greenhouse-effect",
    pathSourcePath: "learner-paths/the-greenhouse-effect/index.path.md",
    pathSourceId: createSourceId(
      "learner-paths/the-greenhouse-effect/index.path.md",
    ),
    pathHref: "./learner-paths/the-greenhouse-effect/index.path.md",
    lessonSourcePath:
      "learner-paths/the-greenhouse-effect/lessons/01-start/index.lesson.md",
    lessonSourceId: createSourceId(
      "learner-paths/the-greenhouse-effect/lessons/01-start/index.lesson.md",
    ),
    lessonHref:
      "./learner-paths/the-greenhouse-effect/lessons/01-start/index.lesson.md",
  })
})

it("reduces traversal-like and non-Latin topics to a safe local slug", () => {
  expect(pathDestinationsForTopic("../../Seasons & Climate").slug).toBe(
    "seasons-climate",
  )
  expect(pathDestinationsForTopic("水循環").pathSourcePath).toBe(
    "learner-paths/learning-path/index.path.md",
  )
})
