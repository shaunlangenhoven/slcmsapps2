import type { ReactNode } from "react"

/** Shared editorial shell for auth screens, matching the FramingAnalyser look. */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-baseline gap-3">
          <div className="font-serif text-lg font-bold italic text-[#0D1B2A]">
            Framing<span className="text-[#C8851A]">Analyser</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7A7060]">
            Restricted Access
          </div>
        </div>

        <div className="rounded-sm border border-[#DDD9CE] bg-white p-8 shadow-sm">
          <div className="mb-6">
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#C8851A]">
              {eyebrow}
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0D1B2A]">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-relaxed text-[#7A7060]">{subtitle}</p>
            ) : null}
          </div>
          {children}
        </div>

        {footer ? <div className="mt-5 text-center">{footer}</div> : null}
      </div>
    </div>
  )
}
