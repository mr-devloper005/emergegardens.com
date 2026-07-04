'use client'

import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session } = useEditableLocalAuthSession()
  const columns = globalContent.footer.columns
  const cta = globalContent.footer.ctaStrip

  return (
    <footer className="relative overflow-hidden bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(700px 260px at 80% -20%, rgba(10,100,238,0.28), transparent 60%), radial-gradient(500px 220px at 8% -10%, rgba(168,199,254,0.16), transparent 60%)',
        }}
      />

      {/* CTA strip — matches Synex "Built for impact" tone */}
      <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-6 pt-24 sm:px-8 lg:px-10">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#0a1a3c_0%,#031229_60%)] px-8 py-14 ring-1 ring-inset ring-white/10 sm:px-12 sm:py-16 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="editable-eyebrow text-[11px] text-[var(--slot4-accent-soft)]">
                {cta.eyebrow}
              </span>
              <h2 className="editable-display mt-4 text-[clamp(2rem,3vw+1rem,3.5rem)] font-medium leading-[1.06] tracking-[-0.025em] text-white">
                {cta.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {!session ? (
                <Link
                  href={cta.primary.href}
                  className="inline-flex items-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_28px_rgba(10,100,238,0.4)] transition duration-300 hover:brightness-110"
                >
                  {cta.primary.label} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_28px_rgba(10,100,238,0.4)] transition duration-300 hover:brightness-110"
                >
                  Submit an entry <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href={cta.secondary.href}
                className="inline-flex items-center gap-2 rounded-[12px] border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white transition duration-300 hover:bg-white/[0.07]"
              >
                {cta.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-6 pt-20 pb-14 sm:px-8 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-10 lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--slot4-accent-fill)] shadow-[0_8px_22px_rgba(10,100,238,0.4)]">
              <img
                src="/favicon.png?v=20260413"
                alt={SITE_CONFIG.name}
                className="h-10 w-10 object-contain"
              />
            </span>
            <span className="editable-display text-[19px] font-medium tracking-[-0.01em]">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
            {globalContent.footer.description}
          </p>
          
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="editable-eyebrow text-[11px] text-[var(--slot4-accent-soft)]">
              {col.title}
            </h3>
            <ul className="mt-5 grid gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-[15px] text-[var(--slot4-muted-text)] transition duration-300 hover:gap-2 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/8">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col gap-2 px-6 py-6 text-xs text-[var(--slot4-soft-muted-text)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© {year} {SITE_CONFIG.name} · {globalContent.footer.bottomNote}</p>
          <p className="editable-eyebrow text-[10px]">{globalContent.footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
