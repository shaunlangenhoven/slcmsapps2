import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
}

/** Returns the current session user, or null if not signed in. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const u = session.user as typeof session.user & { role?: string }
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? "user",
  }
}

/** Requires a signed-in user; redirects to /sign-in otherwise. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  return user
}

/** Requires an admin user; redirects non-admins away. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser()
  if (user.role !== "admin") redirect("/")
  return user
}
