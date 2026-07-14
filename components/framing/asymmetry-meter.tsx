"use client"

import { useEffect, useState } from "react"
import { C } from "@/lib/framing"
import { Label } from "./primitives"

export function AsymmetryMeter({
  score,
  groupA,
  groupB,
}: {
  score: number
  groupA: string
  groupB: string
}) {
  // score: -1 (strongly favours A) to +1 (strongly favours B), 0 = balanced
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200)
    return () => clearTimeout(t)
  }, [score])

  const pct = ((animated + 1) / 2) * 100 // 0–100
  const absScore = Math.abs(score)
  const color = absScore < 0.2 ? C.sage : absScore < 0.5 ? C.amber : C.red
  const label =
    absScore < 0.2
      ? "BROADLY BALANCED"
      : score < 0
        ? `FAVOURS ${groupA.toUpperCase()}`
        : `FAVOURS ${groupB.toUpperCase()}`

  return (
    <div style={{ padding: "20px 24px", background: "#fff", border: `1px solid ${C.ruled}`, borderRadius: 3 }}>
      <Label style={{ marginBottom: 12 }}>Asymmetry Meter — van Dijk Ideological Square</Label>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, maxWidth: 120, lineHeight: 1.3 }}>
          {groupA}
        </span>
        <span
          style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, maxWidth: 120, lineHeight: 1.3, textAlign: "right" }}
        >
          {groupB}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 10, background: C.ruledDim, borderRadius: 5, marginBottom: 10 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            background: `linear-gradient(90deg, ${C.blue}, ${C.ruled}, ${C.red})`,
            borderRadius: 5,
            width: "100%",
            opacity: 0.25,
          }}
        />
        <div style={{ position: "absolute", left: "50%", top: -4, bottom: -4, width: 1, background: C.ruled }} />
        <div
          style={{
            position: "absolute",
            top: -3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: color,
            border: "2px solid #fff",
            boxShadow: `0 0 12px ${color}88`,
            left: `calc(${pct}% - 8px)`,
            transition: "left 1.4s cubic-bezier(0.34,1.56,0.64,1), background 0.6s",
          }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color, letterSpacing: "0.12em" }}>
          {label}
        </span>
      </div>
    </div>
  )
}
