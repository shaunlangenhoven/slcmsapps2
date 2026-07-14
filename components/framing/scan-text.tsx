"use client"

import { useEffect, useMemo, useState } from "react"
import { C } from "@/lib/framing"

export function ScanText({ text }: { text: string }) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (words.length === 0) return
    const iv = setInterval(() => setIdx((i) => (i + 1) % words.length), 55)
    return () => clearInterval(iv)
  }, [words.length])

  return (
    <div
      style={{
        fontFamily: C.sans,
        fontSize: 13,
        lineHeight: 1.8,
        color: C.muted,
        padding: "16px 20px",
        background: "#fff",
        border: `1px solid ${C.ruled}`,
        borderRadius: 3,
        maxHeight: 110,
        overflow: "hidden",
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            color: i === idx ? C.amber : i < idx ? C.ruled : C.muted,
            background: i === idx ? C.amberGlow : "transparent",
            borderRadius: 2,
            marginRight: 4,
            transition: "color 0.08s, background 0.08s",
          }}
        >
          {w}{" "}
        </span>
      ))}
    </div>
  )
}
