import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Get started',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-14rem)] items-center gap-14 pt-24 pb-24 sm:pt-32 lg:grid-cols-[0.9fr_1fr] lg:pt-40`}>
          <EditableReveal>
            <div className={`${dc.surface.card} p-8 sm:p-10`}>
              <h1 className="editable-display text-[24px] font-medium tracking-[-0.02em] text-white">
                {pagesContent.auth.signup.formTitle}
              </h1>
              <div className="mt-6">
                <EditableLocalSignupForm />
              </div>
              <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="text-[var(--slot4-accent-soft)] underline underline-offset-4 hover:text-white">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <div>
              <p className={dc.type.eyebrow}>{pagesContent.auth.signup.badge}</p>
              <h2 className={`mt-6 max-w-xl ${dc.type.heroTitle} text-white`}>
                {pagesContent.auth.signup.title}
              </h2>
              <p className={`mt-6 max-w-lg ${dc.type.body}`}>
                {pagesContent.auth.signup.description}
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
