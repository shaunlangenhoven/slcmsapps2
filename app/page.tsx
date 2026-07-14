import { FramingAnalyser } from "@/components/framing/framing-analyser"
import { requireUser } from "@/lib/session"

export default async function Page() {
  const user = await requireUser()
  return <FramingAnalyser user={{ email: user.email, role: user.role }} />
}
