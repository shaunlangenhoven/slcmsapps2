/* ── DESIGN TOKENS ─────────────────────────────────────────────── */
export const C = {
  paper: "#F7F6F2",
  ink: "#0D1B2A",
  inkLight: "#1E3448",
  ruled: "#DDD9CE",
  ruledDim: "#ECEAE4",
  amber: "#C8851A",
  amberDim: "rgba(200,133,26,0.12)",
  amberGlow: "rgba(200,133,26,0.25)",
  sage: "#4A7C59",
  sageDim: "rgba(74,124,89,0.12)",
  red: "#A0291E",
  redDim: "rgba(160,41,30,0.12)",
  blue: "#1B4F8A",
  blueDim: "rgba(27,79,138,0.12)",
  muted: "#7A7060",
  display: "var(--font-playfair), Georgia, serif",
  sans: "var(--font-source-sans), system-ui, sans-serif",
  mono: "var(--font-jetbrains), monospace",
} as const

/* ── FRAMEWORK DIMENSIONS ──────────────────────────────────────── */
export const DIMENSIONS = [
  { key: "agency", label: "Agency Attribution", desc: "Who acts, who is acted upon; active vs passive role assignment" },
  { key: "lexical", label: "Lexical Choice", desc: "Word selection carrying implicit valence — humanising vs dehumanising vocabulary" },
  { key: "sourcing", label: "Source & Voice", desc: "Whose testimony is centred, quoted directly, or marginalised" },
  { key: "causation", label: "Causal Attribution", desc: "How responsibility for events or outcomes is assigned or obscured" },
  { key: "context", label: "Contextualisation", desc: "Historical or structural context provided for one group but withheld for another" },
  { key: "moral", label: "Moral Framing", desc: "Explicit or implicit moral judgements applied asymmetrically" },
] as const

export type DimensionKey = (typeof DIMENSIONS)[number]["key"]

/* ── PRELOADED EXAMPLES ────────────────────────────────────────── */
export const PRELOADS = [
  {
    id: "protest",
    label: "Protest coverage — asymmetric framing",
    groupA: "Pro-Palestine protesters",
    groupB: "Counter-protesters",
    text: `Pro-Palestine activists stormed the city centre yesterday, blocking traffic and causing widespread disruption to ordinary commuters. Police were forced to intervene after demonstrators refused to disperse. Meanwhile, a smaller group of counter-protesters gathered peacefully nearby to show their support for Israel, holding flags and singing. Officers praised the counter-protest group for their co-operation.`,
  },
  {
    id: "crime",
    label: "Crime reporting — racial framing",
    groupA: "Black suspect",
    groupB: "White suspect",
    text: `A Black man was arrested yesterday in connection with a series of robberies in the area. The suspect, described by neighbours as a troublemaker, has a prior record. Police say the community has long had problems with crime. In a separate incident last week, a local man was taken in for questioning over a financial fraud scheme affecting dozens of victims. His family expressed shock, describing him as a hard-working family man who had fallen on difficult times.`,
  },
  {
    id: "migration",
    label: "Migration — positive vs negative framing",
    groupA: "Asylum seekers",
    groupB: "Expats",
    text: `Hundreds of migrants continued to cross the Channel this week in small boats, straining border resources and costing taxpayers millions. Communities in Kent say they are overwhelmed. The government has vowed to stop the crossings. Separately, a new report highlights the contribution of British expats living across Europe, with many running successful businesses, integrating into local communities and enriching the countries they have chosen to call home.`,
  },
] as const

/* ── RESULT TYPES ──────────────────────────────────────────────── */
export type AsymmetryLevel = "STRONG" | "MODERATE" | "MILD" | "BALANCED"
export type OverallVerdict = "SEVERE" | "MODERATE" | "MILD" | "BALANCED"

export interface DimensionFinding {
  key: DimensionKey
  asymmetryScore: number
  asymmetryLevel: AsymmetryLevel
  analysis: string
  evidenceA: string
  evidenceB: string
}

export interface FramingResult {
  overallVerdict: OverallVerdict
  overallScore: number
  overallSummary: string
  dimensions: DimensionFinding[]
  rhetoricalDevices: string[]
  editorialRecommendations: string
  theoreticalBasis: string
}

export interface AnalysisInput {
  groupA: string
  groupB: string
  text: string
}

export interface HistoryEntry {
  id: number
  groupA: string
  groupB: string
  text: string
  result: FramingResult
  time: string
}
