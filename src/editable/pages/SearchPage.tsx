import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { TASK_DISPLAY } from '@/editable/content/global.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'
import { formatRichHtml } from '@/components/shared/rich-content'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ')
const compactText = (v: unknown) =>
  typeof v === 'string' ? stripHtml(v).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const compactRaw = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const getImage = (post: SitePost) => {
  const c = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((i) => typeof i?.url === 'string')?.url : ''
  const images = Array.isArray(c.images)
    ? (c.images.find((i) => typeof i === 'string') as string | undefined)
    : ''
  return media || compactRaw(c.featuredImage) || compactRaw(c.image) || compactRaw(c.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) =>
  post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const c = getContent(post)
  const typeText = compactText(c.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(c.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, c.description, c.body, c.excerpt, c.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((v) => compactText(v).includes(query))
}

function taskDisplay(task: TaskKey | null | string) {
  if (task === 'listing') return TASK_DISPLAY.listing.singular
  if (task === 'pdf') return TASK_DISPLAY.pdf.singular
  const cfg = SITE_CONFIG.tasks.find((t) => t.key === task)
  return cfg?.label || 'Entry'
}

function SearchResultCard({ post }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((t) => t.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = taskDisplay(task)

  return (
    <Link
      href={href}
      className={`group block overflow-hidden ${dc.surface.card} editable-card-hover`}
    >
      {image ? (
        <div className={`${dc.media.frame} ${dc.media.ratioNews}`}>
          <img
            src={image}
            alt=""
            className="editable-media-zoom absolute inset-0 h-full w-full object-cover"
          />
          <span className={`${dc.badge.pill} absolute left-4 top-4 backdrop-blur`}>{label}</span>
        </div>
      ) : null}
      <div className="p-6">
        {!image ? <span className={dc.badge.pill}>{label}</span> : null}
        <h2 className="editable-display mt-4 line-clamp-2 text-[19px] font-medium leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h2>
        {summary ? <div className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]" dangerouslySetInnerHTML={{ __html: formatRichHtml(summary) }} /> : null}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-accent-soft)] transition duration-300 group-hover:gap-3 group-hover:text-white">
          Open <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks.filter((t) => t.enabled).flatMap((t) => getMockPostsForTask(t.key))
  const results = posts.filter((p) => matches(p, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((t) => t.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40`}>
          <EditableReveal>
            <p className={dc.type.eyebrow}>{pagesContent.search.hero.badge}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-6 max-w-4xl ${dc.type.heroTitle} text-white`}>
              {pagesContent.search.hero.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`mt-6 max-w-2xl ${dc.type.body}`}>{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3}>
            <form action="/search" className={`${dc.surface.card} mt-12 grid gap-3 p-5 sm:p-6`}>
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-[14px] bg-white/[0.04] px-4 py-3.5 ring-1 ring-inset ring-white/10">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-[12px] bg-white/[0.03] px-4 py-3 ring-1 ring-inset ring-white/10">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Category"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <select
                  name="task"
                  defaultValue={task}
                  className="rounded-[12px] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none ring-1 ring-inset ring-white/10"
                >
                  <option value="">All types</option>
                  {enabledTasks.map((t) => {
                    const label = t.key === 'listing' ? TASK_DISPLAY.listing.plural : t.key === 'pdf' ? TASK_DISPLAY.pdf.plural : t.label
                    return (
                      <option key={t.key} value={t.key}>
                        {label}
                      </option>
                    )
                  })}
                </select>
                <button className={dc.button.primary} type="submit">
                  Search <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </EditableReveal>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={dc.type.eyebrow}>{results.length} results</p>
              <h2 className={`mt-4 ${dc.type.subsectionTitle} text-white`}>
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/" className={dc.button.ghost}>
              Back home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index % 6}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className={`${dc.surface.soft} mt-8 border border-dashed border-white/10 p-12 text-center`}>
              <p className="editable-display text-[22px] font-medium tracking-[-0.02em] text-white">
                No matching entries.
              </p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">
                Try a different keyword, type, or category.
              </p>
            </div>
          )}

          <div className="mt-16">
            <Ads
              slot="footer"
              size={pickRandom(getSlotSizes('footer'))}
              showLabel
              className="mx-auto w-full"
            />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
