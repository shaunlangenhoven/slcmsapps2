import Link from "next/link"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { getInvitation } from "@/app/actions/invitations"
import { AuthShell } from "@/components/auth/auth-shell"
import { AcceptInviteForm } from "@/components/auth/accept-invite-form"

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const existing = await getSessionUser()
  if (existing) redirect("/")

  const invite = await getInvitation(token)

  if (!invite) {
    return (
      <AuthShell
        eyebrow="Invitation"
        title="Invitation not found"
        subtitle="This invite link is not valid. Please check the link or request a new invitation."
        footer={
          <Link href="/sign-in" className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#C8851A]">
            Go to sign in
          </Link>
        }
      >
        <div />
      </AuthShell>
    )
  }

  if (!invite.valid) {
    return (
      <AuthShell
        eyebrow="Invitation"
        title="Invitation unavailable"
        subtitle={invite.reason}
        footer={
          <Link href="/sign-in" className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#C8851A]">
            Go to sign in
          </Link>
        }
      >
        <div />
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="You're Invited"
      title="Set up your account"
      subtitle="Complete the form below to activate your access to the Framing Analyser."
      footer={
        <Link href="/sign-in" className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#C8851A]">
          Already have an account? Sign in
        </Link>
      }
    >
      <AcceptInviteForm email={invite.email} role={invite.role} />
    </AuthShell>
  )
}
