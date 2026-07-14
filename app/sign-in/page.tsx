import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export default async function SignInPage() {
  const user = await getSessionUser()
  if (user) redirect("/")

  return (
    <AuthShell
      eyebrow="Members Only"
      title="Sign in"
      subtitle="This tool is available to invited members only. Enter your credentials to continue."
      footer={
        <p className="text-xs leading-relaxed text-[#7A7060]">
          No account? Access is by invitation. Ask an administrator to send you an invite link.
        </p>
      }
    >
      <SignInForm />
    </AuthShell>
  )
}
