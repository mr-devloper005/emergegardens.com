import Link from 'next/link'
import { ArrowUpRight, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, UserRound, Building2 } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { TASK_DISPLAY } from '@/editable/content/global.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((i) => i?.url).filter((u): u is string => typeof u === 'string' && isUrl(u))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((u): u is string => typeof u === 'string' && isUrl(u))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const c = getContent(post)
  for (const k of keys) {
    const v = asText(c[k])
    if (v) return v
  }
  return ''
}
const cleanDomain = (v: string) => v.replace(/^https?:\/\//, '').replace(/\/$/, '')

function displayLabel(task: TaskKey, fallback: string) {
  if (task === 'listing') return TASK_DISPLAY.listing.plural
  if (task === 'pdf') return TASK_DISPLAY.pdf.plural
  return fallback
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const q = params.toString()
  return q ? `${basePath}?${q}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 lg:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase = `${dc.surface.card} editable-card-hover overflow-hidden`

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = displayLabel(task, taskConfig?.label || task)
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((i) => i.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        <header className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(1000px 380px at 82% -10%, rgba(10,100,238,0.28), transparent 65%), radial-gradient(700px 340px at 8% -12%, rgba(168,199,254,0.18), transparent 60%)',
            }}
          />
          <div className={`relative ${dc.shell.section} pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40`}>
            <EditableReveal>
              <div className="flex items-center gap-3 editable-eyebrow text-[11px] text-[var(--slot4-accent-soft)]">
                <span>{voice.eyebrow}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--slot4-accent-soft)]/60" />
                <span className="text-[var(--slot4-muted-text)]">{label}</span>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`mt-6 max-w-4xl ${dc.type.heroTitle} text-white`}>
                {voice.headline}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-[var(--slot4-muted-text)]">
                {voice.description || theme.note}
              </p>
            </EditableReveal>
            {voice.chips?.length ? (
              <EditableReveal index={3}>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span key={chip} className={dc.badge.pill}>
                      {chip}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--slot4-muted-text)]">
                <span className="font-medium text-white">{posts.length}</span>{' '}
                {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-[12px] border border-white/10 bg-white/[0.03] pl-4 pr-10 text-sm font-medium text-white outline-none transition focus:border-[var(--slot4-accent-soft)]"
                    aria-label={voice.filterLabel}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((i) => (
                      <option key={i.slug} value={i.slug}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-muted-text)]" />
                </div>
                <button className={dc.button.primary}>Apply</button>
              </form>
            </div>
          </div>
        </header>

        {task === 'pdf' ? (
          <div className={`${dc.shell.section} mb-2`}>
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
          </div>
        ) : null}

        <section className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
          {posts.length ? (
            <>
              <div className={taskGrid[task]}>
                {posts.map((post, index) => {
                  const isMidFeedAd = task === 'listing' && index === Math.min(3, Math.floor(posts.length / 2))
                  return (
                    <EditableReveal key={post.id || post.slug} index={index % 6}>
                      <>
                        <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                        {isMidFeedAd ? (
                          <div className="mt-5">
                            <Ads
                              slot="in-feed"
                              size={pickRandom(getSlotSizes('in-feed'))}
                              showLabel
                              className="mx-auto w-full"
                            />
                          </div>
                        ) : null}
                      </>
                    </EditableReveal>
                  )
                })}
              </div>
            </>
          ) : (
            <div
              className={`mx-auto max-w-xl ${dc.surface.soft} border border-dashed border-white/12 px-8 py-16 text-center`}
            >
              <Search className="mx-auto h-7 w-7 text-[var(--slot4-muted-text)]" />
              <h2 className="editable-display mt-5 text-2xl font-medium tracking-[-0.02em] text-white">
                Nothing here yet
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">
                {task === 'listing'
                  ? TASK_DISPLAY.listing.empty
                  : task === 'pdf'
                  ? TASK_DISPLAY.pdf.empty
                  : `Try another category, or check back later.`}
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className={dc.button.secondary}>
                  Previous
                </Link>
              ) : null}
              <span className={`${dc.badge.pill} px-5 py-2.5 text-xs`}>
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className={dc.button.secondary}>
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({
  post,
  task,
  basePath,
  index,
}: {
  post: SitePost
  task: TaskKey
  basePath: string
  index: number
}) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent-soft)] transition duration-300 group-hover:gap-2 group-hover:text-white">
      {label}
      <ArrowUpRight className="h-4 w-4" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Note')
  return (
    <Link href={href} className={cardBase}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="editable-media-zoom absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="p-6 sm:p-7">
        <div className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
          {category} · {String(index + 1).padStart(2, '0')}
        </div>
        <h2 className="editable-display mt-3 text-[19px] font-medium leading-[1.2] tracking-[-0.02em] text-white">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
          {getSummary(post)}
        </p>
        <CardArrow label="Read note" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Directory')
  return (
    <Link href={href} className={`${cardBase} flex flex-col sm:flex-row sm:items-stretch`}>
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[var(--tk-raised)] sm:aspect-auto sm:w-56">
        {logo ? (
          <img src={logo} alt="" className="editable-media-zoom absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="h-9 w-9 text-[var(--slot4-muted-text)]" />
          </div>
        )}
      </div>
      <div className="flex-1 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">{category}</span>
          <span className={dc.badge.pill}>Verified</span>
        </div>
        <h2 className="editable-display mt-4 text-[22px] font-medium leading-[1.15] tracking-[-0.02em] text-white">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">
          {getSummary(post)}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--slot4-muted-text)]">
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent-soft)]" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[var(--slot4-accent-soft)]" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[var(--slot4-accent-soft)]" /> {cleanDomain(website)}
            </span>
          ) : null}
        </div>
        <CardArrow label="Open entry" />
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[28px] font-medium tracking-[-0.02em] text-white">
          {price || 'Open offer'}
        </span>
        {condition ? <span className={dc.badge.accentPill}>{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-6 text-[19px] font-medium leading-[1.2] tracking-[-0.02em] text-white">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
        {getSummary(post)}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4 text-xs text-[var(--slot4-muted-text)]">
        <span className="inline-flex items-center gap-1.5">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-accent-soft)]" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className={`${cardBase} mb-5 block break-inside-avoid`}>
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="editable-media-zoom h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(2,10,25,0.8))]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-[16px] font-medium leading-[1.2] tracking-[-0.015em] text-white">
            {post.title}
          </h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/70">
            View <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-white/[0.05] ring-1 ring-inset ring-white/10">
        <Globe className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
          Signal · {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="editable-display mt-2 text-[17px] font-medium leading-[1.25] tracking-[-0.015em] text-white">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-[var(--slot4-muted-text)]">
          {getSummary(post)}
        </p>
        {website ? (
          <p className="mt-3 truncate editable-mono text-[10px] text-[var(--slot4-accent-soft)]">
            {cleanDomain(website)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <FileText className="h-6 w-6 text-[var(--slot4-accent-soft)]" />
        </div>
        <span className={dc.badge.pill}>{category}</span>
      </div>
      <h2 className="editable-display mt-8 text-[19px] font-medium leading-[1.2] tracking-[-0.02em] text-white">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
        {getSummary(post)}
      </p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent-soft)] transition duration-300 group-hover:gap-2 group-hover:text-white">
        Open reference <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[var(--tk-raised)]">
        {avatar ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-10 w-10 text-[var(--slot4-muted-text)]" />
        )}
      </div>
      <h2 className="editable-display mt-5 text-[17px] font-medium tracking-[-0.02em] text-white">
        {post.title}
      </h2>
      {role ? (
        <p className="mt-1.5 editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">{role}</p>
      ) : null}
      <p className="mt-3 line-clamp-2 text-[13px] leading-[1.6] text-[var(--slot4-muted-text)]">
        {getSummary(post)}
      </p>
    </Link>
  )
}
