"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createInvitation, revokeInvitation } from "@/app/actions/invitations"

type Invite = {
  id: string
  email: string
  token: string
  role: string
  status: string
  invitedByEmail: string | null
  expiresAt: Date
  acceptedAt: Date | null
  createdAt: Date
}

export function InviteManager({
  invitations,
  origin,
}: {
  invitations: Invite[]
  origin: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("user")
  const [error, setError] = useState("")
  const [lastLink, setLastLink] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function inviteLink(token: string) {
    return `${origin}/invite/${token}`
  }

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800)
    } catch {
      setError("Could not copy to clipboard.")
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLastLink(null)
    const fd = new FormData()
    fd.set("email", email)
    fd.set("role", role)
    const res = await createInvitation(fd)
    if (!res.ok) {
      setError(res.error)
      return
    }
    const link = inviteLink(res.token)
    setLastLink(link)
    setEmail("")
    setRole("user")
    await copy(link, "new")
    router.refresh()
  }

  function onRevoke(id: string) {
    startTransition(async () => {
      await revokeInvitation(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Create */}
      <section className="rounded-sm border border-[#DDD9CE] bg-white p-6">
        <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#7A7060]">
          Send an invitation
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7A7060]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="person@example.com"
              className="w-full rounded-sm border border-[#DDD9CE] bg-[#F7F6F2] px-3.5 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#C8851A]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7A7060]">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-sm border border-[#DDD9CE] bg-[#F7F6F2] px-3.5 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#C8851A]"
            >
              <option value="user">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={pending || !email}
            className="rounded-sm bg-[#0D1B2A] px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7F6F2] transition-opacity disabled:opacity-40"
          >
            Invite
          </button>
        </form>

        {error ? (
          <div className="mt-3 rounded-sm border border-[#A0291E]/30 bg-[#A0291E]/10 px-3.5 py-2.5 text-sm text-[#A0291E]">
            {error}
          </div>
        ) : null}

        {lastLink ? (
          <div className="mt-4 rounded-sm border border-[#4A7C59]/30 bg-[#4A7C59]/10 p-3.5">
            <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#4A7C59]">
              Invitation link {copied === "new" ? "· copied to clipboard" : "· share this with the invitee"}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-sm bg-white px-2.5 py-2 font-mono text-xs text-[#1E3448]">
                {lastLink}
              </code>
              <button
                onClick={() => copy(lastLink, "new")}
                className="shrink-0 rounded-sm border border-[#DDD9CE] bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#7A7060]"
              >
                Copy
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* List */}
      <section className="rounded-sm border border-[#DDD9CE] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7A7060]">
            Invitations ({invitations.length})
          </div>
        </div>

        {invitations.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#7A7060]">No invitations yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-[#ECEAE4]">
            {invitations.map((inv) => {
              const expired = inv.status === "pending" && new Date(inv.expiresAt) < new Date()
              const status = expired ? "expired" : inv.status
              return (
                <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-[#0D1B2A]">{inv.email}</span>
                      {inv.role === "admin" ? (
                        <span className="rounded-sm border border-[#C8851A]/40 bg-[#C8851A]/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[#C8851A]">
                          admin
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-[#7A7060]">
                      by {inv.invitedByEmail ?? "—"} · expires {new Date(inv.expiresAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusTag status={status} />
                    {status === "pending" ? (
                      <>
                        <button
                          onClick={() => copy(inviteLink(inv.token), inv.id)}
                          className="rounded-sm border border-[#DDD9CE] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#1E3448]"
                        >
                          {copied === inv.id ? "Copied" : "Copy link"}
                        </button>
                        <button
                          onClick={() => onRevoke(inv.id)}
                          disabled={pending}
                          className="rounded-sm border border-[#A0291E]/40 bg-[#A0291E]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#A0291E] disabled:opacity-40"
                        >
                          Revoke
                        </button>
                      </>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function StatusTag({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    pending: { color: "#C8851A", label: "pending" },
    accepted: { color: "#4A7C59", label: "accepted" },
    revoked: { color: "#A0291E", label: "revoked" },
    expired: { color: "#7A7060", label: "expired" },
  }
  const s = map[status] ?? map.pending
  return (
    <span
      className="rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em]"
      style={{ color: s.color, background: `${s.color}1f`, border: `1px solid ${s.color}44` }}
    >
      {s.label}
    </span>
  )
}
