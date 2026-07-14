"use server"

import { db } from "@/lib/db"
import { invitation, user } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/session"
import { and, desc, eq, gt } from "drizzle-orm"
import { randomBytes, randomUUID } from "crypto"
import { revalidatePath } from "next/cache"

const INVITE_TTL_DAYS = 7

export type InviteInfo = {
  email: string
  role: string
  valid: boolean
  reason?: string
}

/** Public: look up an invitation by token to render the accept page. */
export async function getInvitation(token: string): Promise<InviteInfo | null> {
  if (!token) return null
  const [invite] = await db
    .select()
    .from(invitation)
    .where(eq(invitation.token, token))
    .limit(1)

  if (!invite) return null

  if (invite.status === "accepted") {
    return { email: invite.email, role: invite.role, valid: false, reason: "This invitation has already been used." }
  }
  if (invite.status === "revoked") {
    return { email: invite.email, role: invite.role, valid: false, reason: "This invitation has been revoked." }
  }
  if (invite.expiresAt < new Date()) {
    return { email: invite.email, role: invite.role, valid: false, reason: "This invitation has expired." }
  }
  return { email: invite.email, role: invite.role, valid: true }
}

/** Admin: create a new invitation and return its shareable token. */
export async function createInvitation(formData: FormData) {
  const admin = await requireAdmin()
  const rawEmail = String(formData.get("email") ?? "")
  const role = String(formData.get("role") ?? "user") === "admin" ? "admin" : "user"
  const email = rawEmail.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Please enter a valid email address." }
  }

  // Already a member?
  const [existingUser] = await db.select().from(user).where(eq(user.email, email)).limit(1)
  if (existingUser) {
    return { ok: false as const, error: "A user with that email already exists." }
  }

  // Existing pending invite? Reuse it (refresh expiry) rather than duplicate.
  const [pending] = await db
    .select()
    .from(invitation)
    .where(and(eq(invitation.email, email), eq(invitation.status, "pending")))
    .limit(1)

  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000)

  if (pending) {
    await db
      .update(invitation)
      .set({ role, expiresAt })
      .where(eq(invitation.id, pending.id))
    revalidatePath("/admin")
    return { ok: true as const, token: pending.token }
  }

  const token = randomBytes(24).toString("base64url")
  await db.insert(invitation).values({
    id: randomUUID(),
    email,
    token,
    role,
    status: "pending",
    invitedBy: admin.id,
    invitedByEmail: admin.email,
    expiresAt,
  })

  revalidatePath("/admin")
  return { ok: true as const, token }
}

/** Admin: revoke a pending invitation. */
export async function revokeInvitation(id: string) {
  await requireAdmin()
  await db
    .update(invitation)
    .set({ status: "revoked" })
    .where(and(eq(invitation.id, id), eq(invitation.status, "pending")))
  revalidatePath("/admin")
  return { ok: true as const }
}

/** Admin: list all invitations, newest first. */
export async function listInvitations() {
  await requireAdmin()
  return db.select().from(invitation).orderBy(desc(invitation.createdAt))
}

/** Admin: count of currently valid pending invitations. */
export async function countPendingInvitations() {
  await requireAdmin()
  const rows = await db
    .select()
    .from(invitation)
    .where(and(eq(invitation.status, "pending"), gt(invitation.expiresAt, new Date())))
  return rows.length
}
