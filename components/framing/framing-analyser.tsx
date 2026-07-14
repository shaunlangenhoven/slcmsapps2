"use client"

import { useState } from "react"
import { C, PRELOADS } from "@/lib/framing"
import type { FramingResult, HistoryEntry } from "@/lib/framing"
import { analyzeFraming } from "@/app/actions"
import { Label, Tag } from "./primitives"
import { ScanText } from "./scan-text"
import { InputScreen } from "./input-screen"
import { ReportScreen } from "./report-screen"
import { AccountMenu } from "./account-menu"

type Screen = "input" | "loading" | "report"

export function FramingAnalyser({ user }: { user: { email: string; role: string } }) {
  const [screen, setScreen] = useState<Screen>("input")
  const [text, setText] = useState("")
  const [groupA, setGroupA] = useState("")
  const [groupB, setGroupB] = useState("")
  const [result, setResult] = useState<FramingResult | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [error, setError] = useState("")

  function loadPreset(p: (typeof PRELOADS)[number]) {
    setText(p.text)
    setGroupA(p.groupA)
    setGroupB(p.groupB)
    setError("")
  }

  async function runAnalysis() {
    if (!text.trim() || !groupA.trim() || !groupB.trim()) return
    setScreen("loading")
    setError("")

    const res = await analyzeFraming({ groupA, groupB, text })

    if (!res.ok) {
      setError(res.error)
      setScreen("input")
      return
    }

    const entry: HistoryEntry = {
      id: Date.now(),
      groupA,
      groupB,
      text,
      result: res.result,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }
    setHistory((h) => [entry, ...h])
    setResult(res.result)
    setScreen("report")
  }

  function openHistory(h: HistoryEntry) {
    setResult(h.result)
    setGroupA(h.groupA)
    setGroupB(h.groupB)
    setText(h.text)
    setScreen("report")
  }

  return (
    <div style={{ background: C.paper, minHeight: "100vh", fontFamily: C.sans, color: C.ink }}>
      {/* Header */}
      <header
        style={{
          background: C.ink,
          color: C.paper,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          borderBottom: `3px solid ${C.amber}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontFamily: C.display, fontSize: 18, fontWeight: 700, fontStyle: "italic" }}>
            Framing<span style={{ color: C.amber }}>Analyser</span>
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: "0.16em", color: "#7a8fa0" }}>
            CRITICAL DISCOURSE ANALYSIS ENGINE
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {history.length > 0 && (
            <div style={{ display: "flex", gap: 6 }}>
              {history.slice(0, 4).map((h, i) => (
                <button
                  key={h.id}
                  onClick={() => openHistory(h)}
                  title={`${h.groupA} vs ${h.groupB} · ${h.time}`}
                  style={{
                    padding: "6px 10px",
                    minHeight: 32,
                    background: "transparent",
                    border: "1px solid #2a3f52",
                    borderRadius: 2,
                    cursor: "pointer",
                    fontFamily: C.mono,
                    fontSize: 9,
                    color: "#7a8fa0",
                    letterSpacing: "0.1em",
                  }}
                >
                  #{i + 1}
                </button>
              ))}
            </div>
          )}
          <Tag color={C.amber} bg="rgba(200,133,26,0.15)">
            van Dijk · Entman · Wodak
          </Tag>
          <AccountMenu email={user.email} role={user.role} />
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: "40px 20px" }}>
        {screen === "input" && (
          <InputScreen
            text={text}
            groupA={groupA}
            groupB={groupB}
            error={error}
            setText={setText}
            setGroupA={setGroupA}
            setGroupB={setGroupB}
            onLoadPreset={loadPreset}
            onAnalyse={runAnalysis}
          />
        )}

        {screen === "loading" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: 24,
            }}
          >
            <Label style={{ color: C.amber }}>Scanning for framing asymmetries</Label>
            <div style={{ width: "min(500px, 90%)" }}>
              <ScanText text={text} />
            </div>
            <Label>Applying van Dijk Ideological Square…</Label>
            <div style={{ width: 260, height: 3, background: C.ruledDim, borderRadius: 2, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)`,
                  animation: "fa-scan 1.6s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        )}

        {screen === "report" && result && (
          <ReportScreen result={result} groupA={groupA} groupB={groupB} text={text} onReset={() => setScreen("input")} />
        )}
      </main>
    </div>
  )
}
