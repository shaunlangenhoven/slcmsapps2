import { C } from "@/lib/framing"
import type { DimensionFinding, AsymmetryLevel } from "@/lib/framing"
import { Label, Tag } from "./primitives"

type Dim = { key: string; label: string; desc: string }

const LEVEL_STYLE: Record<AsymmetryLevel, { label: string; color: string; bg: string }> = {
  STRONG: { label: "STRONG ASYMMETRY", color: C.red, bg: C.redDim },
  MODERATE: { label: "MODERATE ASYMMETRY", color: C.amber, bg: C.amberDim },
  MILD: { label: "MILD ASYMMETRY", color: C.amber, bg: C.amberDim },
  BALANCED: { label: "BALANCED", color: C.sage, bg: C.sageDim },
}

export function DimBar({ dim, finding }: { dim: Dim; finding?: DimensionFinding }) {
  if (!finding) return null
  const score = finding.asymmetryScore || 0
  const pct = ((score + 1) / 2) * 100
  const abs = Math.abs(score)
  const barColor = abs < 0.2 ? C.sage : abs < 0.55 ? C.amber : C.red
  const s = LEVEL_STYLE[finding.asymmetryLevel] || LEVEL_STYLE.BALANCED

  return (
    <div style={{ padding: "14px 16px", background: "#fff", border: `1px solid ${C.ruled}`, borderRadius: 3, marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <div style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 600, color: C.ink }}>{dim.label}</div>
        <Tag color={s.color} bg={s.bg}>
          {s.label}
        </Tag>
      </div>
      <div style={{ fontFamily: C.sans, fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.5 }}>
        {dim.desc}
      </div>

      {/* Mini meter */}
      <div style={{ position: "relative", height: 6, background: C.ruledDim, borderRadius: 3, marginBottom: 10 }}>
        <div style={{ position: "absolute", left: "50%", top: -2, bottom: -2, width: 1, background: C.ruled }} />
        <div
          style={{
            position: "absolute",
            top: -1,
            width: 12,
            height: 8,
            borderRadius: 3,
            background: barColor,
            left: `calc(${pct}% - 6px)`,
            transition: "left 1s ease",
          }}
        />
      </div>

      <div style={{ fontFamily: C.sans, fontSize: 12, color: C.inkLight, lineHeight: 1.65 }}>{finding.analysis}</div>
      {finding.evidenceA && (
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: "8px 10px", background: C.blueDim, borderLeft: `2px solid ${C.blue}`, borderRadius: 2 }}>
            <Label style={{ marginBottom: 4, color: C.blue }}>Group A</Label>
            <div style={{ fontFamily: C.display, fontStyle: "italic", fontSize: 11, color: C.inkLight, lineHeight: 1.5 }}>
              {`"${finding.evidenceA}"`}
            </div>
          </div>
          <div style={{ padding: "8px 10px", background: C.redDim, borderLeft: `2px solid ${C.red}`, borderRadius: 2 }}>
            <Label style={{ marginBottom: 4, color: C.red }}>Group B</Label>
            <div style={{ fontFamily: C.display, fontStyle: "italic", fontSize: 11, color: C.inkLight, lineHeight: 1.5 }}>
              {`"${finding.evidenceB}"`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
