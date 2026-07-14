"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await signIn.email({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message || "Sign in failed. Check your credentials.")
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-sm border border-[#DDD9CE] bg-[#F7F6F2] px-3.5 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#C8851A]"
        />
      </Field>
      <Field label="Password">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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
        disabled={loading || !email || !password}
        className="mt-1 rounded-sm bg-[#0D1B2A] px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7F6F2] transition-opacity disabled:opacity-40"
      >
        {loading ? "Signing in…" : "Sign In"}
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
