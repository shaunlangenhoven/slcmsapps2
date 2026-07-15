"use client"

import { C, PRELOADS } from "@/lib/framing"
import { Label } from "./primitives"

export function InputScreen({
  text,
  groupA,
  groupB,
  error,
  setText,
  setGroupA,
  setGroupB,
  onLoadPreset,
  onAnalyse,
  onClear,
}: {
  text: string
  groupA: string
  groupB: string
  error: string
  setText: (v: string) => void
  setGroupA: (v: string) => void
  setGroupB: (v: string) => void
  onLoadPreset: (p: (typeof PRELOADS)[number]) => void
  onAnalyse: () => void
  onClear: () => void
}) {
  const ready = !!text.trim() && !!groupA.trim() && !!groupB.trim()
  const hasInput = !!text || !!groupA || !!groupB
  const groups: [string, string, (v: string) => void, string, string][] = [
    ["Group A", groupA, setGroupA, C.blue, "e.g. Asylum seekers"],
    ["Group B", groupB, setGroupB, C.red, "e.g. Expats"],
  ]

  return (
    <div style={{ maxWidth: 740, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ marginBottom: 36 }}>
        <Label style={{ marginBottom: 10, color: C.amber }}>Critical Discourse Analysis Engine</Label>
        <h1 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 900, lineHeight: 1.15, color: C.ink, marginBottom: 12 }}>
          Framing Analyser
        </h1>
        <p style={{ fontFamily: C.sans, fontSize: 15, color: C.muted, lineHeight: 1.7, maxWidth: 560 }}>
          Detects prejudicial and asymmetric framing in commentary and journalism using van Dijk&apos;s Ideological
          Square and Entman&apos;s Framing Theory. Name two groups and submit a text.
        </p>
      </div>

      {/* Group inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {groups.map(([lbl, val, set, col, ph]) => (
          <div key={lbl}>
            <Label style={{ color: col, marginBottom: 6 }}>{lbl} — Subject Group</Label>
            <input
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder={ph}
              style={{
                width: "100%",
                padding: "12px 14px",
                minHeight: 44,
                background: "#fff",
                border: `1px solid ${C.ruled}`,
                borderRadius: 3,
                fontFamily: C.sans,
                fontSize: 16,
                color: C.ink,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}
      </div>

      {/* Textarea */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <Label>Text for Analysis</Label>
          <span style={{ fontFamily: C.mono, fontSize: 10, color: C.muted }}>{text.length} chars</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste the article, commentary, or statement to analyse…"
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "#fff",
            border: `1px solid ${C.ruled}`,
            borderRadius: 3,
            fontFamily: C.sans,
            fontSize: 16,
            color: C.ink,
            lineHeight: 1.7,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: C.redDim,
            border: `1px solid ${C.red}44`,
            borderRadius: 3,
            fontSize: 13,
            color: C.red,
            marginBottom: 16,
            fontFamily: C.sans,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <button
          onClick={onAnalyse}
          disabled={!ready}
          style={{
            flex: 1,
            padding: "14px",
            minHeight: 44,
            background: ready ? C.ink : C.ruled,
            color: ready ? C.paper : C.muted,
            border: "none",
            borderRadius: 3,
            cursor: ready ? "pointer" : "not-allowed",
            fontFamily: C.mono,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            transition: "background 0.2s",
          }}
        >
          ▶ &nbsp; Analyse Framing
        </button>
        <button
          onClick={onClear}
          disabled={!hasInput}
          style={{
            padding: "14px 20px",
            minHeight: 44,
            background: "transparent",
            color: hasInput ? C.red : C.ruled,
            border: `1px solid ${hasInput ? `${C.red}66` : C.ruled}`,
            borderRadius: 3,
            cursor: hasInput ? "pointer" : "not-allowed",
            fontFamily: C.mono,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          Clear
        </button>
      </div>

      {/* Preloads */}
      <div>
        <Label style={{ marginBottom: 12 }}>Example Texts — Preloaded</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PRELOADS.map((p) => (
            <button
              key={p.id}
              onClick={() => onLoadPreset(p)}
              style={{
                textAlign: "left",
                padding: "14px 16px",
                minHeight: 44,
                background: "#fff",
                border: `1px solid ${C.ruled}`,
                borderRadius: 3,
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.amber)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.ruled)}
            >
              <div style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 3 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted }}>
                <span style={{ color: C.blue }}>A: {p.groupA}</span>
                <span style={{ margin: "0 8px", color: C.ruled }}>·</span>
                <span style={{ color: C.red }}>B: {p.groupB}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
