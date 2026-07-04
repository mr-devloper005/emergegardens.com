import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className={`${dc.shell.section} pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40`}>
          <EditableReveal>
            <p className={dc.type.eyebrow}>{pagesContent.about.badge}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-6 max-w-4xl ${dc.type.heroTitle} text-white`}>
              {pagesContent.about.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`mt-8 max-w-3xl ${dc.type.body}`}>{pagesContent.about.description}</p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditableReveal>
              <h2 className={`${dc.type.sectionTitle} text-white`}>Why {SITE_CONFIG.name} exists.</h2>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="space-y-5 max-w-2xl">
                {pagesContent.about.paragraphs.map((p) => (
                  <p key={p} className={dc.type.body}>{p}</p>
                ))}
              </div>
            </EditableReveal>
          </div>

          <div className="mt-24 grid gap-6 md:grid-cols-3">
            {pagesContent.about.values.map((value, i) => (
              <EditableReveal key={value.title} index={i + 1}>
                <div className={`${dc.surface.soft} h-full p-8`}>
                  <span className="editable-mono text-[11px] text-[var(--slot4-accent-soft)]">
                    0{i + 1}
                  </span>
                  <h3 className="editable-display mt-4 text-[19px] font-medium tracking-[-0.015em] text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
                    {value.description}
                  </p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
