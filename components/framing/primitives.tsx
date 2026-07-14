import type { CSSProperties, ReactNode } from "react"
import { C } from "@/lib/framing"

export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: C.mono,
        fontSize: 9,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.muted,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Tag({ children, color, bg }: { children: ReactNode; color: string; bg: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 2,
        fontFamily: C.mono,
        fontSize: 9,
        letterSpacing: "0.12em",
        fontWeight: 600,
        color,
        background: bg,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  )
}

export function Divider({ my = 24 }: { my?: number }) {
  return <div style={{ borderTop: `1px solid ${C.ruled}`, margin: `${my}px 0` }} />
}
