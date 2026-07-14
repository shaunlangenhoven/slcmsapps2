"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

export function AccountMenu({
  email,
  role,
}: {
  email: string
  role: string
}) {
  const router = useRouter()

  async function onSignOut() {
    await signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 9,
          letterSpacing: "0.1em",
          color: "#7a8fa0",
        }}
      >
        {email}
      </span>
      {role === "admin" && (
        <a
          href="/admin"
          style={{
            padding: "6px 10px",
            minHeight: 32,
            display: "inline-flex",
            alignItems: "center",
            background: "transparent",
            border: "1px solid #2a3f52",
            borderRadius: 2,
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: 9,
            color: "#C8851A",
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          ADMIN
        </a>
      )}
      <button
        onClick={onSignOut}
        style={{
          padding: "6px 10px",
          minHeight: 32,
          background: "transparent",
          border: "1px solid #2a3f52",
          borderRadius: 2,
          cursor: "pointer",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 9,
          color: "#7a8fa0",
          letterSpacing: "0.1em",
        }}
      >
        SIGN OUT
      </button>
    </div>
  )
}
