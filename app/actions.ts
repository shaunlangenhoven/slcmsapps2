"use server"

import { generateObject } from "ai"
import { z } from "zod"
import type { AnalysisInput, FramingResult } from "@/lib/framing"
import { getSessionUser } from "@/lib/session"

const dimensionSchema = z.object({
  key: z.enum(["agency", "lexical", "sourcing", "causation", "context", "moral"]),
  asymmetryScore: z
    .number()
    .min(-1)
    .max(1)
    .describe("-1.0 strongly favours Group A, 0 balanced, +1.0 strongly favours Group B"),
  asymmetryLevel: z.enum(["STRONG", "MODERATE", "MILD", "BALANCED"]),
  analysis: z.string().describe("A two sentence finding for this dimension"),
  evidenceA: z.string().describe("A verbatim phrase from the text relating to Group A, or an empty string"),
  evidenceB: z.string().describe("A verbatim phrase from the text relating to Group B, or an empty string"),
})

const resultSchema = z.object({
  overallVerdict: z.enum(["SEVERE", "MODERATE", "MILD", "BALANCED"]),
  overallScore: z.number().min(-1).max(1),
  overallSummary: z.string().describe("A 2-3 sentence editorial summary of the framing pattern found"),
  dimensions: z.array(dimensionSchema).length(6),
  rhetoricalDevices: z
    .array(z.string())
    .describe("Specific rhetorical or linguistic devices detected, e.g. nominalisation, passive voice, euphemism"),
  editorialRecommendations: z
    .string()
    .describe("3-4 concrete suggestions a journalist or editor could act on to achieve more balanced framing"),
  theoreticalBasis: z
    .string()
    .describe("1-2 sentences naming the specific academic frameworks most applicable to what was found"),
})

const SYSTEM = `You are an expert in Critical Discourse Analysis applying van Dijk's Ideological Square and Entman's Framing Theory to detect prejudicial or asymmetric framing in media texts and political commentary.

You analyse how two named groups are framed differently across six dimensions:
1. agency — Agency Attribution: who acts, who is acted upon
2. lexical — Lexical Choice: word selection carrying implicit valence
3. sourcing — Source & Voice: whose testimony is centred or marginalised
4. causation — Causal Attribution: how responsibility is assigned or obscured
5. context — Contextualisation: historical/structural context applied asymmetrically
6. moral — Moral Framing: moral judgements applied asymmetrically

For each dimension, assign an asymmetryScore from -1.0 to +1.0:
  -1.0 = strongly favours Group A (positive framing of A, negative of B)
   0.0 = balanced
  +1.0 = strongly favours Group B (positive framing of B, negative of A)

Return findings for all six dimensions in the order listed above. Base evidence on verbatim phrases from the supplied text.`

export async function analyzeFraming(input: AnalysisInput): Promise<
  { ok: true; result: FramingResult } | { ok: false; error: string }
> {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return { ok: false, error: "You must be signed in to run an analysis." }
  }

  const { groupA, groupB, text } = input
  if (!groupA.trim() || !groupB.trim() || !text.trim()) {
    return { ok: false, error: "Please provide both groups and a text to analyse." }
  }

  try {
    const { object } = await generateObject({
      model: "google/gemini-2.5-flash",
      schema: resultSchema,
      system: SYSTEM,
      prompt: `Group A: ${groupA}\nGroup B: ${groupB}\n\nText to analyse:\n\n${text}`,
    })

    return { ok: true, result: object as FramingResult }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.log("[v0] analyzeFraming error:", message)
    if (/rate limit|429|quota|too many requests/i.test(message)) {
      return {
        ok: false,
        error: "The analysis service is temporarily rate-limited. Please wait a moment and try again.",
      }
    }
    return { ok: false, error: "Analysis failed. Please try again." }
  }
}
