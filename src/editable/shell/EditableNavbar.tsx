'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, LogIn, ArrowRight, LogOut, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Static, non-task nav links only. No links to task archive pages.
const STATIC_NAV = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 bg-[color-mix(in_oklab,var(--slot4-page-bg)_82%,transparent)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-4 px-6 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--slot4-accent-fill)] shadow-[0_8px_22px_rgba(10,100,238,0.45)] transition duration-500 group-hover:scale-105">
            <img
              src="/favicon.png?v=20260413"
              alt={SITE_CONFIG.name}
              className="h-9 w-9 object-contain"
            />
          </span>
          <span className="editable-display max-w-[220px] truncate text-[17px] font-medium tracking-[-0.01em]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="ml-6 hidden items-center gap-1 lg:flex">
          {STATIC_NAV.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[10px] px-3.5 py-2 text-[14px] font-medium transition duration-300 ${
                  active
                    ? 'text-white bg-white/[0.06]'
                    : 'text-[var(--slot4-muted-text)] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-[10px] text-[var(--slot4-muted-text)] transition duration-300 hover:bg-white/[0.05] hover:text-white sm:inline-flex"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-[12px] border border-white/12 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white transition duration-300 hover:bg-white/[0.07] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-[12px] px-3 py-2 text-[13px] font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:text-white sm:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-[12px] px-4 py-2 text-[13px] font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:text-white sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-[12px] bg-[var(--slot4-accent-fill)] px-4 py-2 text-[13px] font-medium text-white shadow-[0_10px_24px_rgba(10,100,238,0.4)] transition duration-300 hover:brightness-110 sm:inline-flex"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-border)]" />

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-6 py-6 lg:hidden">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="mb-4 flex items-center gap-3 rounded-[12px] bg-white/[0.04] px-4 py-3 text-sm text-[var(--slot4-muted-text)]"
          >
            <Search className="h-4 w-4" /> Search the platform
          </Link>
          <div className="grid gap-1.5">
            {[...STATIC_NAV,
              ...(session
                ? [{ label: 'Submit', href: '/create' }]
                : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }]),
            ].map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[12px] px-4 py-3 text-[15px] font-medium transition ${
                    active
                      ? 'bg-white/[0.08] text-white'
                      : 'text-[var(--slot4-muted-text)] hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-[12px] px-4 py-3 text-left text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:bg-white/[0.04] hover:text-white"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
