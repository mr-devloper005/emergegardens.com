import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/login',
    title: 'Sign in',
    description: pagesContent.auth.login.metadataDescription,
  })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-14rem)] items-center gap-14 pt-24 pb-24 sm:pt-32 lg:grid-cols-[1fr_0.9fr] lg:pt-40`}>
          <EditableReveal>
            <div>
              <p className={dc.type.eyebrow}>{pagesContent.auth.login.badge}</p>
              <h1 className={`mt-6 max-w-xl ${dc.type.heroTitle} text-white`}>
                {pagesContent.auth.login.title}
              </h1>
              <p className={`mt-6 max-w-lg ${dc.type.body}`}>
                {pagesContent.auth.login.description}
              </p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className={`${dc.surface.card} p-8 sm:p-10`}>
              <h2 className="editable-display text-[24px] font-medium tracking-[-0.02em] text-white">
                {pagesContent.auth.login.formTitle}
              </h2>
              <div className="mt-6">
                <EditableLocalLoginForm />
              </div>
              <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
                New here?{' '}
                <Link href="/signup" className="text-[var(--slot4-accent-soft)] underline underline-offset-4 hover:text-white">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
