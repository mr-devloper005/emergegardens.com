'use client'

import { Building2, FileText, Mail, MapPin, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'

const LANES = [
  {
    icon: Building2,
    title: 'Directory suggestions',
    body: 'Suggest a place we should add. Verified entries only — details go through review.',
  },
  {
    icon: FileText,
    title: 'Library submissions',
    body: 'Have a reference worth adding to the library? Send it in for indexing.',
  },
  {
    icon: MapPin,
    title: 'Coverage requests',
    body: 'Missing a neighborhood, region, or category? Tell us where to extend the directory next.',
  },
  {
    icon: Sparkles,
    title: 'Corrections',
    body: 'Something wrong on an entry or a reference? Point us to it and we will fix and republish.',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className={`${dc.shell.section} pt-24 pb-14 sm:pt-32 lg:pt-40`}>
          <EditableReveal>
            <p className={dc.type.eyebrow}>{pagesContent.contact.eyebrow}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-6 max-w-4xl ${dc.type.heroTitle} text-white`}>
              {pagesContent.contact.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`mt-6 max-w-2xl ${dc.type.body}`}>
              {pagesContent.contact.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-24`}>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="grid gap-4">
              {LANES.map((lane, i) => (
                <EditableReveal key={lane.title} index={i}>
                  <div className={`${dc.surface.soft} p-6`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/[0.05] ring-1 ring-inset ring-white/10">
                      <lane.icon className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                    </div>
                    <h2 className="editable-display mt-5 text-[17px] font-medium tracking-[-0.015em] text-white">
                      {lane.title}
                    </h2>
                    <p className="mt-2 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
                      {lane.body}
                    </p>
                  </div>
                </EditableReveal>
              ))}
              <div className={`${dc.surface.dark} p-6`}>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-[var(--slot4-accent-soft)]" />
                  <div>
                    <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">Direct</p>
                    <p className="mt-2 text-[14px] text-white">
                      Prefer email? Send anything to the address on file — we route it internally.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <EditableReveal index={4}>
              <div className={`${dc.surface.card} p-8 sm:p-10`}>
                <h2 className={`${dc.type.subsectionTitle} text-white`}>
                  {pagesContent.contact.formTitle}
                </h2>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
