'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Building2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { TASK_DISPLAY } from '@/editable/content/global.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: FileText,
  image: FileText,
  profile: FileText,
  pdf: FileText,
  sbm: FileText,
}

function taskLabelFor(key: TaskKey, fallback: string) {
  if (key === 'listing') return TASK_DISPLAY.listing.plural
  if (key === 'pdf') return TASK_DISPLAY.pdf.plural
  return fallback
}

const fieldClass =
  'w-full rounded-[12px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent-soft)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((t) => t.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((t) => t.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? taskLabelFor(activeTask.key, activeTask.label) : 'Entry'

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main>
          <section className={`${dc.shell.section} grid gap-12 pt-24 pb-24 sm:pt-32 md:grid-cols-[0.85fr_1.15fr] lg:pt-40`}>
            <EditableReveal>
              <div className={`${dc.surface.dark} flex h-full min-h-60 items-center justify-center p-10`}>
                <Lock className="h-16 w-16 text-[var(--slot4-accent-soft)] opacity-80" />
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="self-center">
                <p className={dc.type.eyebrow}>{pagesContent.create.locked.badge}</p>
                <h1 className={`mt-6 ${dc.type.heroTitle} text-white`}>{pagesContent.create.locked.title}</h1>
                <p className={`mt-6 max-w-xl ${dc.type.body}`}>{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Create account
                  </Link>
                </div>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main>
        <section className={`${dc.shell.section} pt-24 pb-24 sm:pt-32 lg:pt-40`}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <EditableReveal>
              <aside>
                <p className={dc.type.eyebrow}>{pagesContent.create.hero.badge}</p>
                <h1 className={`mt-6 ${dc.type.heroTitle} text-white`}>{pagesContent.create.hero.title}</h1>
                <p className={`mt-6 max-w-xl ${dc.type.body}`}>{pagesContent.create.hero.description}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {enabledTasks.map((item) => {
                    const Icon = taskIcon[item.key] || FileText
                    const active = item.key === task
                    const label = taskLabelFor(item.key, item.label)
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`rounded-[16px] p-5 text-left transition duration-300 ${
                          active
                            ? 'bg-[var(--slot4-accent-fill)] text-white shadow-[0_10px_28px_rgba(10,100,238,0.35)]'
                            : `${dc.surface.soft} hover:bg-white/[0.05]`
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="editable-display mt-4 block text-[15px] font-medium tracking-[-0.01em]">
                          {label}
                        </span>
                        <span className="mt-1 block text-xs opacity-70">
                          {item.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </aside>
            </EditableReveal>

            <EditableReveal index={1}>
              <form onSubmit={submit} className={`${dc.surface.card} p-6 sm:p-9`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className={dc.type.eyebrow}>Submit {activeLabel}</p>
                    <h2 className={`mt-3 ${dc.type.subsectionTitle} text-white`}>
                      {pagesContent.create.formTitle}
                    </h2>
                  </div>
                  <span className={dc.badge.pill}>{session.name}</span>
                </div>

                <div className="mt-8 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Website or source URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Featured image URL" />
                  <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" required />
                  <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Main content, details, notes" required />
                </div>

                {created ? (
                  <div className="mt-6 flex items-center gap-2 rounded-[12px] bg-[color-mix(in_oklab,var(--slot4-accent)_20%,transparent)] px-4 py-3 text-sm text-white ring-1 ring-inset ring-[color-mix(in_oklab,var(--slot4-accent)_40%,transparent)]">
                    <CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                    <span>{pagesContent.create.successTitle} · {created.title}</span>
                  </div>
                ) : null}

                <button type="submit" className={`${dc.button.primary} mt-6 w-full`}>
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
