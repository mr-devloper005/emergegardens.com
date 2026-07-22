import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Camera, CheckCircle2, Compass, Download,
  ExternalLink, FileText, Globe2, Mail, MapPin, Phone, ShieldCheck, UserRound, Clock,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { TASK_DISPLAY } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>,
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ----------------- shared parsers (unchanged behavior) ----------------- */
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const isUrl = (v: string) => v.startsWith('/') || /^https?:\/\//i.test(v)

const getField = (post: SitePost, keys: string[]) => {
  const c = getContent(post)
  for (const k of keys) {
    const val = asText(c[k])
    if (val) return val
  }
  return ''
}

const getImages = (post: SitePost) => {
  const c = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((i) => i?.url).filter((u): u is string => typeof u === 'string' && isUrl(u))
    : []
  const images = Array.isArray(c.images)
    ? c.images.filter((u): u is string => typeof u === 'string' && isUrl(u))
    : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((k) => asText(c[k]))
    .filter((u) => u && isUrl(u))
  return [...media, ...images, ...singles].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const c = getContent(post)
  return (
    asText(c.body) ||
    asText(c.description) ||
    asText(c.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (v: string) => (/^https?:\/\//i.test(v) ? v : '#')
const linkifyMarkdown = (v: string) =>
  v.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`,
  )
const linkifyText = (v: string) =>
  linkifyMarkdown(v).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`,
  )
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let n = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(n)) n += ' target="_blank"'
    if (!/\srel=/i.test(n)) n += ' rel="nofollow noopener noreferrer"'
    return `<a ${n}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )
const formatPlainText = (raw: string) => {
  const v = raw.trim()
  if (!v) return ''
  if (/<[a-z][\s\S]*>/i.test(v)) return sanitizeHtml(linkifyMarkdown(v))
  return v
    .split(/\n{2,}/)
    .map((p) => `<p>${linkifyText(escapeHtml(p).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const s = summaryText(post)
  if (!s) return ''
  const lead = stripHtml(s)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

function displayLabel(task: TaskKey, fallback: string) {
  if (task === 'listing') return TASK_DISPLAY.listing.plural
  if (task === 'pdf') return TASK_DISPLAY.pdf.plural
  return fallback
}
function backLabel(task: TaskKey) {
  const cfg = getTaskConfig(task)
  return displayLabel(task, cfg?.label || 'posts')
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ================================================================== */
/* Shared: numbered-section spine — the visual identity of the new    */
/* detail layout. Left gutter = mono index + eyebrow; right = content.*/
/* ================================================================== */
function NumberedSection({
  index,
  label,
  title,
  children,
  id,
}: {
  index: number
  label: string
  title?: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <section
      id={id}
      className="grid gap-8 border-t border-white/8 py-14 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-14 sm:py-20 lg:grid-cols-[220px_minmax(0,1fr)]"
    >
      <div className="sm:sticky sm:top-24 sm:self-start">
        <div className="editable-mono text-[11px] leading-none text-[var(--slot4-accent-soft)]">
          {String(index).padStart(2, '0')}
        </div>
        <div className="editable-eyebrow mt-4 text-[10px] text-[var(--slot4-muted-text)]">{label}</div>
        {title ? (
          <h2 className="editable-display mt-5 text-[clamp(1.4rem,1.3vw+0.9rem,1.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
            {title}
          </h2>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="editable-eyebrow flex items-center gap-2.5 text-[11px] text-[var(--slot4-accent-soft)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--slot4-accent-soft)] opacity-60" />
      <span className="text-[var(--slot4-muted-text)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const cfg = getTaskConfig(task)
  return (
    <Link
      href={cfg?.route || '/'}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {backLabel(task).toLowerCase()}
    </Link>
  )
}

/* ================================================================== */
/* ARTICLE (unchanged shape; column reading layout)                   */
/* ================================================================== */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <BackLink task="article" />
        <p className="editable-eyebrow mt-10 text-[11px] text-[var(--slot4-accent-soft)]">
          {categoryOf(post, 'Field note')}
        </p>
        <h1 className={`mt-6 ${dc.type.heroTitle} text-white`}>{post.title}</h1>
        <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">{SITE_CONFIG.name}</p>
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="mt-12 aspect-[16/9] w-full rounded-[20px] object-cover ring-1 ring-inset ring-white/10"
          />
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ================================================================== */
/* LISTING — new numbered-section layout                              */
/* ================================================================== */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0] || '/placeholder.svg?height=800&width=1600'
  const gallery = images.slice(1)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openHours', 'timing']) || 'Mon – Sat · 9:00 – 18:00'
  const category = categoryOf(post, TASK_DISPLAY.listing.singular)
  const mapSrc = mapSrcFor(post)
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 8) : []
  const lead = leadText(post)

  return (
    <>
      {/* Slim top strip */}
      <div className={`${dc.shell.section} flex flex-wrap items-center gap-3 pt-10`}>
        <BackLink task="listing" />
        <span className="hidden text-white/20 sm:inline">/</span>
        <Kicker task="listing">{category}</Kicker>
        <span className={`${dc.badge.accentPill} ml-auto`}>
          <ShieldCheck className="h-3 w-3" /> Verified entry
        </span>
      </div>

      {/* Full-bleed cinematic hero */}
      <div className="relative mt-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,25,0.05)_0%,rgba(2,10,25,0.35)_50%,rgba(2,10,25,0.95)_100%)]" />
        </div>
        <div className={`${dc.shell.section} relative -mt-[35vh] pb-6 sm:-mt-[38vh] lg:-mt-[42vh]`}>
          <h1 className="editable-display max-w-5xl text-[clamp(2.75rem,7vw+1rem,6.5rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
            {post.title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            {address ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[var(--slot4-accent-soft)]" /> {address}
              </span>
            ) : null}
            {phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-[var(--slot4-accent-soft)]" /> {phone}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[var(--slot4-accent-soft)]" /> {hours}
            </span>
          </div>
        </div>
      </div>

      {/* Numbered sections */}
      <div className={`${dc.shell.section} pb-16 pt-6`}>
        <NumberedSection index={1} label="Overview" title="About this entry.">
          {lead ? (
            <p className="editable-display max-w-3xl text-[clamp(1.15rem,0.8vw+0.95rem,1.4rem)] font-normal leading-[1.55] tracking-[-0.01em] text-white/90">
              {lead}
            </p>
          ) : null}
          <BodyContent post={post} />
          {tags.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className={dc.badge.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </NumberedSection>

        <NumberedSection index={2} label="Contact" title="Reach out.">
          <div className={`${dc.surface.card} p-6 sm:p-8`}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {address ? (
                <ContactRow icon={MapPin} label={address} href={mapSrc ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined} sub="Address" />
              ) : null}
              {phone ? <ContactRow icon={Phone} label={phone} href={`tel:${phone}`} sub="Phone" /> : null}
              {email ? <ContactRow icon={Mail} label={email} href={`mailto:${email}`} sub="Email" /> : null}
              {website ? (
                <ContactRow icon={Globe2} label={website.replace(/^https?:\/\//, '')} href={website} sub="Website" external />
              ) : null}
              <ContactRow icon={Clock} label={hours} sub="Hours" />
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              {website ? (
                <Link href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>
                  Open website <ExternalLink className="h-4 w-4" />
                </Link>
              ) : phone ? (
                <a href={`tel:${phone}`} className={dc.button.primary}>
                  Call now <Phone className="h-4 w-4" />
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className={dc.button.secondary}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
            </div>
          </div>
        </NumberedSection>

        {gallery.length ? (
          <NumberedSection index={3} label="Gallery" title="Inside the entry.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.slice(0, 6).map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="aspect-[4/3] w-full rounded-[16px] object-cover ring-1 ring-inset ring-white/10"
                />
              ))}
            </div>
          </NumberedSection>
        ) : null}

        {mapSrc ? (
          <NumberedSection index={gallery.length ? 4 : 3} label="Location" title="Find it on the map.">
            <div className="overflow-hidden rounded-[20px] ring-1 ring-inset ring-white/10">
              <div className="flex items-center gap-2 bg-white/[0.03] p-4 text-sm font-medium">
                <MapPin className="h-4 w-4 text-[var(--slot4-accent-soft)]" /> {address || 'Map'}
              </div>
              <iframe src={mapSrc} title="Map" loading="lazy" className="h-80 w-full border-0" />
            </div>
          </NumberedSection>
        ) : null}

        <NumberedSection
          index={(gallery.length ? 1 : 0) + (mapSrc ? 1 : 0) + 3}
          label="Verified"
          title="Reviewed by the team."
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className={`${dc.surface.soft} p-6 sm:p-8`}>
              <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
                Verified by {SITE_CONFIG.name}
              </p>
              <ul className="mt-5 grid gap-3">
                {[
                  'Contact details verified',
                  'Location cross-checked on the map',
                  'Reviewed within the last review cycle',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-[var(--slot4-muted-text)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent-soft)]" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Ads
                slot="sidebar"
                size={pickRandom(getSlotSizes('sidebar'))}
                showLabel
                className="mx-auto w-full"
              />
            </div>
          </div>
        </NumberedSection>
      </div>

      {/* Floating action dock */}
      <ActionDock
        actions={[
          phone ? { icon: Phone, label: 'Call', href: `tel:${phone}` } : null,
          website ? { icon: Globe2, label: 'Website', href: website, external: true } : null,
          mapSrc && address
            ? { icon: Compass, label: 'Directions', href: `https://maps.google.com/?q=${encodeURIComponent(address)}`, external: true }
            : null,
        ]}
      />

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function ContactRow({
  icon: Icon,
  label,
  href,
  sub,
  external,
}: {
  icon: typeof MapPin
  label: string
  href?: string
  sub?: string
  external?: boolean
}) {
  const inner = (
    <div className="flex items-center gap-3 rounded-[12px] bg-white/[0.03] p-3 ring-1 ring-inset ring-white/10 transition duration-300 hover:bg-white/[0.06]">
      <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/[0.05] ring-1 ring-inset ring-white/10">
        <Icon className="h-4 w-4 text-[var(--slot4-accent-soft)]" />
      </span>
      <span className="min-w-0 flex-1">
        {sub ? (
          <span className="editable-eyebrow block text-[9px] text-[var(--slot4-soft-muted-text)]">{sub}</span>
        ) : null}
        <span className="mt-0.5 block truncate text-[14px] text-white">{label}</span>
      </span>
      {href ? <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" /> : null}
    </div>
  )
  if (!href) return <li>{inner}</li>
  return (
    <li>
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
        {inner}
      </a>
    </li>
  )
}

type DockAction = { icon: typeof Phone; label: string; href: string; external?: boolean } | null
function ActionDock({ actions }: { actions: DockAction[] }) {
  const list = actions.filter((a): a is Exclude<DockAction, null> => a !== null)
  if (!list.length) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/12 bg-[color-mix(in_oklab,var(--slot4-page-bg)_86%,transparent)] p-1 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {list.map((a) => (
          <a
            key={a.label}
            href={a.href}
            target={a.external ? '_blank' : undefined}
            rel={a.external ? 'noreferrer' : undefined}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-white transition duration-300 hover:bg-white/[0.08]"
          >
            <a.icon className="h-4 w-4 text-[var(--slot4-accent-soft)]" />
            {a.label}
          </a>
        ))}
      </div>
    </div>
  )
}

/* ================================================================== */
/* CLASSIFIED                                                         */
/* ================================================================== */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className={`${dc.shell.section} grid gap-10 pt-16 pb-24 lg:grid-cols-[360px_minmax(0,1fr)] sm:pt-20`}>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className={`${dc.surface.card} mt-8 p-7`}>
            <Kicker task="classified">{categoryOf(post, 'Offer')}</Kicker>
            <h1 className="editable-display mt-4 text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-white">
              {post.title}
            </h1>
            <p className="editable-display mt-6 text-[40px] font-medium leading-none tracking-[-0.03em] text-[var(--slot4-accent-soft)]">
              {price || 'Open offer'}
            </p>
            <div className="mt-6 grid gap-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 grid gap-2.5">
              {phone ? (
                <a href={`tel:${phone}`} className={`${dc.button.primary} w-full`}>
                  <Phone className="h-4 w-4" /> Call
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className={`${dc.button.secondary} w-full`}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {images.slice(0, 4).map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="aspect-[4/3] rounded-[16px] object-cover ring-1 ring-inset ring-white/10"
                />
              ))}
            </div>
          ) : null}
          <BodyContent post={post} />
          <div className={`${dc.surface.soft} mt-10 p-6`}>
            <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">Quick actions</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {website ? (
                <Link href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>
                  Website <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              {phone ? <a href={`tel:${phone}`} className={dc.button.secondary}>Call</a> : null}
              {email ? <a href={`mailto:${email}`} className={dc.button.secondary}>Email</a> : null}
            </div>
          </div>
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ================================================================== */
/* IMAGE                                                              */
/* ================================================================== */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className={`${dc.shell.section} pt-16 pb-24 sm:pt-20`}>
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-4 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure
                key={`${image}-${index}`}
                className="mb-4 break-inside-avoid overflow-hidden rounded-[16px] ring-1 ring-inset ring-white/10"
              >
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <span className={dc.badge.pill}>
              <Camera className="h-3 w-3" /> Image story
            </span>
            <h1 className="editable-display mt-6 text-[clamp(2rem,3vw+1rem,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
              {post.title}
            </h1>
            {leadText(post) ? (
              <p className={`mt-5 ${dc.type.body}`}>{leadText(post)}</p>
            ) : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ================================================================== */
/* BOOKMARK                                                           */
/* ================================================================== */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-[14px] bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <Bookmark className="h-6 w-6 text-[var(--slot4-accent-soft)]" />
        </div>
        <div className="mt-6">
          <Kicker task="sbm">Signal</Kicker>
        </div>
        <h1 className={`mt-6 ${dc.type.heroTitle} text-white`}>{post.title}</h1>
        {leadText(post) ? <p className={`mt-6 ${dc.type.body}`}>{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} mt-8`}>
            Open <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ================================================================== */
/* PDF — simple layout: PDF as head component, minimal content below   */
/* ================================================================== */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const fileName = getField(post, ['filename', 'name']) || `${post.slug || 'document'}.pdf`

  return (
    <>
      {/* Slim top strip */}
      <div className={`${dc.shell.section} flex flex-wrap items-center gap-3 pt-8`}>
        <BackLink task="pdf" />
      </div>

      {/* PDF as head component — shown first, full width */}
      <div className={`${dc.shell.section} mt-6`}>
        {fileUrl ? (
          <div className="overflow-hidden rounded-[20px] ring-1 ring-inset ring-white/10">
            <div className="flex items-center justify-between gap-3 bg-white/[0.03] px-5 py-3">
              <span className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
                PDF preview
              </span>
              <span className="editable-mono text-[10px] text-[var(--slot4-muted-text)]">{fileName}</span>
            </div>
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={post.title}
              className="h-[86vh] w-full bg-[var(--tk-raised)]"
            />
          </div>
        ) : (
          <div className="flex h-[60vh] items-center justify-center rounded-[20px] bg-white/[0.02] ring-1 ring-inset ring-white/10">
            <div className="text-center">
              <FileText className="mx-auto h-10 w-10 text-[var(--slot4-muted-text)]" />
              <p className="mt-4 text-[var(--slot4-muted-text)]">The file will appear here once uploaded.</p>
            </div>
          </div>
        )}
      </div>

      {/* Title + download actions below the PDF */}
      <div className={`${dc.shell.section} mt-10 pb-16`}>
        <h1 className="editable-display max-w-4xl text-[clamp(1.8rem,3vw+0.8rem,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
          {post.title}
        </h1>
        {fileUrl ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.primary}>
              Download PDF <Download className="h-4 w-4" />
            </Link>
            <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>
              Open in new tab <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>

      <PdfRelatedStrip related={related} />
    </>
  )
}

/* ================================================================== */
/* PROFILE                                                            */
/* ================================================================== */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${dc.shell.section} grid gap-10 pt-16 pb-24 lg:grid-cols-[360px_minmax(0,1fr)] sm:pt-20`}>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="profile" />
          <div className={`${dc.surface.card} mt-8 p-8 text-center`}>
            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-white/10 bg-white/[0.03]">
              {images[0] ? (
                <img src={images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-12 w-12 text-[var(--slot4-muted-text)]" />
              )}
            </div>
            <h1 className="editable-display mt-6 text-[22px] font-medium tracking-[-0.02em] text-white">
              {post.title}
            </h1>
            {role ? (
              <p className="editable-eyebrow mt-2 text-[10px] text-[var(--slot4-accent-soft)]">{role}</p>
            ) : null}
            <div className="mt-6 grid gap-2.5">
              {website ? (
                <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} w-full`}>
                  Visit <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className={`${dc.button.secondary} w-full`}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <Kicker task="profile">Contributor</Kicker>
          <BodyContent post={post} />
          {images.slice(1).length ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {images.slice(1, 7).map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="aspect-[4/3] rounded-[16px] object-cover ring-1 ring-inset ring-white/10"
                />
              ))}
            </div>
          ) : null}
        </article>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ------------------- shared blocks ------------------- */
function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-2 max-w-none text-[var(--slot4-page-text)] ${
        compact ? 'text-[15px] leading-[1.65]' : 'text-[17px] leading-[1.8]'
      }`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] bg-white/[0.04] px-4 py-3 text-sm ring-1 ring-inset ring-white/10">
      <span className="editable-eyebrow text-[10px] text-[var(--slot4-soft-muted-text)]">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const cfg = getTaskConfig(task)
  const label = displayLabel(task, cfg?.label || 'posts')
  return (
    <section className="border-t border-white/8">
      <div className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
        <div className="flex items-center justify-between">
          <h2 className={`${dc.type.subsectionTitle} text-white`}>More {label.toLowerCase()}</h2>
          <Link href={cfg?.route || '/'} className={dc.button.ghost}>
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <RelatedCard key={item.id || item.slug} task={task} post={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const cfg = getTaskConfig('pdf')
  return (
    <section className="border-t border-white/8">
      <div className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
        <div className="flex items-center justify-between">
          <h2 className={`${dc.type.subsectionTitle} text-white`}>
            More from the {TASK_DISPLAY.pdf.plural}
          </h2>
          <Link href={cfg?.route || '/pdf'} className={dc.button.ghost}>
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const cat = categoryOf(item, 'Reference')
            const sizeGuess = getField(item, ['fileSize', 'size']) || 'PDF'
            const href = `${cfg?.route || '/pdf'}/${item.slug}`
            return (
              <Link
                key={item.id || item.slug}
                href={href}
                className={`${dc.surface.card} p-5 editable-card-hover flex flex-col`}
              >
                <div className="editable-display flex h-24 w-full items-center justify-center rounded-[14px] bg-[color-mix(in_oklab,var(--slot4-accent)_16%,transparent)] text-[32px] font-medium tracking-[-0.02em] text-[var(--slot4-accent-soft)] ring-1 ring-inset ring-white/8">
                  PDF
                </div>
                <p className="editable-eyebrow mt-5 text-[10px] text-[var(--slot4-accent-soft)]">{cat}</p>
                <h3 className="editable-display mt-2 line-clamp-2 text-[16px] font-medium leading-[1.25] tracking-[-0.015em] text-white">
                  {item.title}
                </h3>
                <span className={`${dc.badge.tag} mt-4 w-fit`}>{sizeGuess}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const cfg = getTaskConfig(task)
  const href = `${cfg?.route || `/${task}`}/${post.slug}`
  const image = getImages(post)[0]
  return (
    <Link
      href={href}
      className={`${dc.surface.card} overflow-hidden editable-card-hover`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratioNews}`}>
        {image ? (
          <img src={image} alt="" className="editable-media-zoom absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="h-7 w-7 text-[var(--slot4-muted-text)]" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="editable-display line-clamp-2 text-[15px] font-medium leading-[1.25] tracking-[-0.015em] text-white">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-[var(--slot4-muted-text)]">
          {stripHtml(summaryText(post))}
        </p>
      </div>
    </Link>
  )
}
