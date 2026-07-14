import { C } from "@/lib/framing"
import type { OverallVerdict } from "@/lib/framing"
import { Label } from "./primitives"

const MAP: Record<OverallVerdict, { color: string; bg: string; label: string }> = {
  SEVERE: { color: C.red, bg: C.redDim, label: "SEVERE PREJUDICIAL FRAMING" },
  MODERATE: { color: C.amber, bg: C.amberDim, label: "MODERATE PREJUDICIAL FRAMING" },
  MILD: { color: C.amber, bg: C.amberDim, label: "MILD PREJUDICIAL FRAMING" },
  BALANCED: { color: C.sage, bg: C.sageDim, label: "BROADLY BALANCED" },
}

export function Verdict({ level }: { level: OverallVerdict }) {
  const v = MAP[level] || MAP.BALANCED
  return (
    <div
      style={{
        padding: "14px 18px",
        borderLeft: `4px solid ${v.color}`,
        background: v.bg,
        borderRadius: "0 3px 3px 0",
        marginBottom: 20,
      }}
    >
      <Label style={{ color: v.color, marginBottom: 6 }}>Overall Framing Verdict</Label>
      <div style={{ fontFamily: C.display, fontSize: 16, fontStyle: "italic", color: C.ink }}>{v.label}</div>
    </div>
  )
}
