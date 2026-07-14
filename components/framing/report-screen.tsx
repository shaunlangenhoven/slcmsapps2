"use client"

import { useState } from "react"
import { C, DIMENSIONS } from "@/lib/framing"
import type { FramingResult } from "@/lib/framing"
import { Label } from "./primitives"
import { AsymmetryMeter } from "./asymmetry-meter"
import { DimBar } from "./dimension-bar"
import { Verdict } from "./verdict"

const TABS = ["Overview", "Dimensions", "Rhetoric", "Recommendations"] as const

export function ReportScreen({
  result,
  groupA,
  groupB,
  text,
  onReset,
}: {
  result: FramingResult
  groupA: string
  groupB: string
  text: string
  onReset: () => void
}) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Label style={{ marginBottom: 8 }}>Framing Analysis Report</Label>
          <h2 style={{ fontFamily: C.display, fontSize: 20, fontWeight: 700, fontStyle: "italic", color: C.ink, marginBottom: 4 }}>
            {groupA} <span style={{ color: C.muted, fontWeight: 400, fontSize: 16 }}>vs</span> {groupB}
          </h2>
        </div>
        <button
          onClick={onReset}
          style={{
            padding: "10px 16px",
            minHeight: 44,
            background: "transparent",
            border: `1px solid ${C.ruled}`,
            borderRadius: 3,
            cursor: "pointer",
            fontFamily: C.mono,
            fontSize: 10,
            color: C.muted,
            letterSpacing: "0.1em",
          }}
        >
          ← New Analysis
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.ruled}`, marginBottom: 28, overflowX: "auto" }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "11px 20px",
              minHeight: 44,
              whiteSpace: "nowrap",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === i ? `2px solid ${C.amber}` : "2px solid transparent",
              cursor: "pointer",
              fontFamily: C.sans,
              fontSize: 13,
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? C.ink : C.muted,
              marginBottom: -2,
              transition: "color 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB 0: Overview */}
      {activeTab === 0 && (
        <div className="fa-overview-grid" style={{ display: "grid", gap: 20, alignItems: "start" }}>
          <div>
            <Verdict level={result.overallVerdict} />
            <div style={{ padding: "16px 18px", background: "#fff", border: `1px solid ${C.ruled}`, borderRadius: 3, marginBottom: 16 }}>
              <Label style={{ marginBottom: 8 }}>Editorial Summary</Label>
              <p style={{ fontFamily: C.sans, fontSize: 13, lineHeight: 1.75, color: C.inkLight }}>
                {result.overallSummary}
              </p>
            </div>
            {result.theoreticalBasis && (
              <div style={{ padding: "12px 16px", background: C.amberDim, border: `1px solid ${C.amber}44`, borderRadius: 3 }}>
                <Label style={{ color: C.amber, marginBottom: 6 }}>Theoretical Basis</Label>
                <p style={{ fontFamily: C.sans, fontSize: 12, color: C.inkLight, lineHeight: 1.65 }}>
                  {result.theoreticalBasis}
                </p>
              </div>
            )}
          </div>
          <div>
            <AsymmetryMeter score={result.overallScore || 0} groupA={groupA} groupB={groupB} />
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#fff", border: `1px solid ${C.ruled}`, borderRadius: 3 }}>
              <Label style={{ marginBottom: 10 }}>Dimension Snapshot</Label>
              {result.dimensions?.map((d) => {
                const dim = DIMENSIONS.find((x) => x.key === d.key)
                if (!dim) return null
                const abs = Math.abs(d.asymmetryScore || 0)
                const col = abs < 0.2 ? C.sage : abs < 0.55 ? C.amber : C.red
                const pct = (((d.asymmetryScore || 0) + 1) / 2) * 100
                return (
                  <div key={d.key} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontFamily: C.sans, fontSize: 11, color: C.muted }}>{dim.label}</span>
                      <span style={{ fontFamily: C.mono, fontSize: 10, color: col }}>{d.asymmetryLevel}</span>
                    </div>
                    <div style={{ height: 4, background: C.ruledDim, borderRadius: 2, position: "relative" }}>
                      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.ruled }} />
                      <div
                        style={{
                          position: "absolute",
                          top: -1,
                          width: 10,
                          height: 6,
                          borderRadius: 3,
                          background: col,
                          left: `calc(${pct}% - 5px)`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Dimensions */}
      {activeTab === 1 && (
        <div>
          {result.dimensions?.map((d) => {
            const dim = DIMENSIONS.find((x) => x.key === d.key)
            return dim ? <DimBar key={d.key} dim={dim} finding={d} /> : null
          })}
        </div>
      )}

      {/* TAB 2: Rhetoric */}
      {activeTab === 2 && (
        <div className="fa-two-col" style={{ display: "grid", gap: 16, alignItems: "start" }}>
          <div style={{ padding: "18px 20px", background: "#fff", border: `1px solid ${C.ruled}`, borderRadius: 3 }}>
            <Label style={{ marginBottom: 12 }}>Rhetorical Devices Detected</Label>
            {result.rhetoricalDevices?.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  marginBottom: 6,
                  background: C.paper,
                  border: `1px solid ${C.ruled}`,
                  borderRadius: 2,
                  fontFamily: C.sans,
                  fontSize: 13,
                  color: C.inkLight,
                }}
              >
                <span style={{ fontFamily: C.mono, fontSize: 10, color: C.amber, marginRight: 8 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {d}
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 20px", background: "#fff", border: `1px solid ${C.ruled}`, borderRadius: 3 }}>
            <Label style={{ marginBottom: 12 }}>Source Text</Label>
            <div
              style={{
                fontFamily: C.sans,
                fontSize: 13,
                lineHeight: 1.75,
                color: C.muted,
                padding: "12px 14px",
                background: C.paper,
                borderRadius: 2,
                border: `1px solid ${C.ruled}`,
                maxHeight: 280,
                overflowY: "auto",
              }}
            >
              {text}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Recommendations */}
      {activeTab === 3 && (
        <div>
          <div style={{ padding: "20px 24px", background: "#fff", border: `1px solid ${C.ruled}`, borderRadius: 3, marginBottom: 16 }}>
            <Label style={{ marginBottom: 12 }}>Editorial Recommendations</Label>
            <div style={{ fontFamily: C.sans, fontSize: 14, lineHeight: 1.85, color: C.inkLight, whiteSpace: "pre-line" }}>
              {result.editorialRecommendations}
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: C.amberDim, border: `1px dashed ${C.amber}66`, borderRadius: 3 }}>
            <Label style={{ color: C.amber, marginBottom: 6 }}>Methodological Note</Label>
            <p style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, lineHeight: 1.65 }}>
              This analysis applies van Dijk&apos;s Ideological Square (1998), Entman&apos;s Framing Theory (1993), and
              Wodak&apos;s Discourse-Historical Approach. Findings are probabilistic and context-dependent. Framing
              asymmetry may reflect editorial decisions, source availability, or systemic bias — this tool does not
              distinguish between them. All findings should be treated as hypotheses for further editorial scrutiny, not
              definitive verdicts.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
