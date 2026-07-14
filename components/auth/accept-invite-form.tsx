"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"

export function AcceptInviteForm({ email, role }: { email: string; role: string }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    const { error } = await signUp.email({ email, password, name: name.trim() || email })
    setLoading(false)
    if (error) {
      setError(error.message || "Could not create your account.")
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Email (from invitation)">
        <input
          type="email"
          value={email}
          readOnly
          className="w-full cursor-not-allowed rounded-sm border border-[#DDD9CE] bg-[#ECEAE4] px-3.5 py-2.5 text-sm text-[#7A7060] outline-none"
        />
      </Field>
      {role === "admin" ? (
        <div className="rounded-sm border border-[#C8851A]/30 bg-[#C8851A]/10 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#C8851A]">
          Administrator invitation
        </div>
      ) : null}
      <Field label="Full name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="w-full rounded-sm border border-[#DDD9CE] bg-[#F7F6F2] px-3.5 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#C8851A]"
        />
      </Field>
      <Field label="Create password">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full rounded-sm border border-[#DDD9CE] bg-[#F7F6F2] px-3.5 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#C8851A]"
        />
      </Field>
      <Field label="Confirm password">
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full rounded-sm border border-[#DDD9CE] bg-[#F7F6F2] px-3.5 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#C8851A]"
        />
      </Field>

      {error ? (
        <div className="rounded-sm border border-[#A0291E]/30 bg-[#A0291E]/10 px-3.5 py-2.5 text-sm text-[#A0291E]">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-sm bg-[#0D1B2A] px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7F6F2] transition-opacity disabled:opacity-40"
      >
        {loading ? "Creating account…" : "Accept & Create Account"}
      </button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7A7060]">
        {label}
      </span>
      {children}
    </label>
  )
}
