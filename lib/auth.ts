import { betterAuth } from "better-auth"
import { pool, db } from "@/lib/db"
import { invitation } from "@/lib/db/schema"
import { and, eq, gt } from "drizzle-orm"

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}

/**
 * Returns the role a signing-up user should receive, or null if they are not
 * allowed to register at all. Admin emails may always register. Everyone else
 * needs a valid, pending, non-expired invitation matching their email.
 */
export async function resolveSignupRole(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase()
  if (isAdminEmail(normalized)) return "admin"

  const [invite] = await db
    .select()
    .from(invitation)
    .where(
      and(
        eq(invitation.email, normalized),
        eq(invitation.status, "pending"),
        gt(invitation.expiresAt, new Date()),
      ),
    )
    .limit(1)

  if (!invite) return null
  return invite.role
}

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // never settable from the client
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          // Invite-only backstop: block any registration without a valid
          // invitation (or an admin email). This runs server-side and cannot
          // be bypassed from the client.
          const role = await resolveSignupRole(userData.email)
          if (!role) {
            throw new Error(
              "Registration is invite-only. A valid invitation is required to create an account.",
            )
          }
          return { data: { ...userData, role } }
        },
        after: async (createdUser) => {
          // Mark any matching pending invitation as accepted.
          await db
            .update(invitation)
            .set({ status: "accepted", acceptedAt: new Date() })
            .where(
              and(
                eq(invitation.email, createdUser.email.trim().toLowerCase()),
                eq(invitation.status, "pending"),
              ),
            )
        },
      },
    },
  },
  trustedOrigins: [
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})
