import Link from "next/link"
import { headers } from "next/headers"
import { requireAdmin } from "@/lib/session"
import { listInvitations } from "@/app/actions/invitations"
import { InviteManager } from "@/components/admin/invite-manager"

export default async function AdminPage() {
  const admin = await requireAdmin()
  const invitations = await listInvitations()

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? ""
  const proto = h.get("x-forwarded-proto") ?? "https"
  const origin = host ? `${proto}://${host}` : ""

  const pending = invitations.filter(
    (i) => i.status === "pending" && new Date(i.expiresAt) > new Date(),
  ).length
  const accepted = invitations.filter((i) => i.status === "accepted").length

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      {/* Header */}
      <header className="flex items-center justify-between border-b-[3px] border-[#C8851A] bg-[#0D1B2A] px-6 py-3.5 text-[#F7F6F2]">
        <div className="flex items-baseline gap-3">
          <div className="font-serif text-lg font-bold italic">
            Framing<span className="text-[#C8851A]">Analyser</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7a8fa0]">
            Admin Console
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] text-[#7a8fa0] sm:inline">{admin.email}</span>
          <Link
            href="/"
            className="rounded-sm border border-[#2a3f52] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a8fa0]"
          >
            ← App
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#C8851A]">
            Access Control
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0D1B2A]">Invitations</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#7A7060]">
            Access is invite-only. Create an invitation to generate a private link, then share it with
            the invited person. They set their own password when they accept.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Pending" value={pending} />
          <Stat label="Accepted" value={accepted} />
          <Stat label="Total" value={invitations.length} />
        </div>

        <InviteManager invitations={invitations} origin={origin} />
      </main>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-[#DDD9CE] bg-white p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7A7060]">{label}</div>
      <div className="mt-1 font-serif text-2xl font-bold text-[#0D1B2A]">{value}</div>
    </div>
  )
}
