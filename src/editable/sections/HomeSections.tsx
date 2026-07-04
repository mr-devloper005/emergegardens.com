import Link from 'next/link'
import { ArrowRight, ArrowUpRight, FileText, MapPin, Search, Building2, Layers, ShieldCheck } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { TASK_DISPLAY } from '@/editable/content/global.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import EditableReveal from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function excerptOf(post?: SitePost | null, limit = 140) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ===================================================================== */
/* 1. HERO — p-home-intro                                                */
/* ===================================================================== */
export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const heroPool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 3)

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1000px 480px at 82% -10%, rgba(10,100,238,0.35), transparent 65%), radial-gradient(700px 400px at 6% 15%, rgba(168,199,254,0.22), transparent 62%)',
        }}
      />
      <div className={`relative ${dc.shell.section} pt-24 pb-24 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32`}>
        <EditableReveal>
          <div className={dc.type.eyebrow}>{hero.badge}</div>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="editable-display mt-6 max-w-[18ch] text-[clamp(3rem,6vw+1rem,6.25rem)] font-medium leading-[1.01] tracking-[-0.035em] text-white">
            {hero.title.map((line, i) => (
              <span key={i} className="block">
                {i === hero.title.length - 1 ? (
                  <span className="text-[var(--slot4-accent-soft)]">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
        </EditableReveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <EditableReveal index={2}>
            <div className="max-w-xl">
              <p className={dc.type.body}>{hero.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={hero.primaryCta.href} className={dc.button.primary}>
                  {hero.primaryCta.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
              <form action="/search" className="mt-8 flex max-w-lg items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur">
                <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  placeholder={hero.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
                <button className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)] transition hover:text-white">
                  Search →
                </button>
              </form>
            </div>
          </EditableReveal>

          <EditableReveal index={3}>
            <div className="grid gap-3">
              {heroPool.length === 0 ? (
                <div className={`${dc.surface.soft} p-6`}>
                  <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">Latest</p>
                  <p className="mt-3 text-[var(--slot4-muted-text)]">Live entries and references will surface here.</p>
                </div>
              ) : (
                heroPool.map((post, i) => (
                  <Link
                    key={post.id || post.slug}
                    href={postHref('listing', post, primaryRoute)}
                    className={`group flex items-center gap-4 ${dc.surface.soft} p-4 editable-card-hover`}
                  >
                    <div className={`${dc.media.frame} h-16 w-16 shrink-0 rounded-[12px]`}>
                      <img
                        src={getEditablePostImage(post)}
                        alt=""
                        className="editable-media-zoom absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
                        {categoryOf(post) || `New · 0${i + 1}`}
                      </p>
                      <p className="editable-display mt-1 line-clamp-1 text-[15px] font-medium tracking-[-0.01em] text-white">
                        {post.title}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </Link>
                ))
              )}
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ===================================================================== */
/* 2. FEATURE + STAT BAND — p-home-feature                               */
/* ===================================================================== */
export function EditableFoundationSection() {
  const intro = pagesContent.home.intro
  const stats = pagesContent.home.stats
  return (
    <section className="relative">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <EditableReveal>
            <div>
              <div className={dc.type.eyebrow}>{intro.badge}</div>
              <h2 className={`mt-6 ${dc.type.sectionTitle} text-white`}>{intro.title}</h2>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="max-w-2xl space-y-5">
              {intro.paragraphs.map((p, i) => (
                <p key={i} className={dc.type.body}>{p}</p>
              ))}
              <div className="pt-4">
                <Link href={intro.primaryLink.href} className={dc.button.ghost}>
                  {intro.primaryLink.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </EditableReveal>
        </div>

        <div className="mt-24">
          <EditableReveal>
            <p className={dc.type.eyebrow}>{stats.eyebrow}</p>
            <h3 className="editable-display mt-4 text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-medium tracking-[-0.02em] text-white">
              {stats.title}
            </h3>
          </EditableReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {stats.items.map((item, i) => (
              <EditableReveal key={item.label} index={i + 1}>
                <div className={`${dc.surface.soft} px-8 py-10`}>
                  <div className={`${dc.type.stat} editable-count`}>{item.value}</div>
                  <p className="mt-4 text-[15px] text-[var(--slot4-muted-text)]">{item.label}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===================================================================== */
/* 3. PRODUCT SHOWCASE — p-home-product (two surfaces)                   */
/* ===================================================================== */
const SURFACES = [
  {
    key: 'listing' as const,
    icon: MapPin,
    kicker: TASK_DISPLAY.listing.plural,
    title: 'A verified place to start.',
    body: 'Structured profiles with contact, hours, tags and location. Reviewed before publish; cross-linked to supporting references.',
    href: '/listings',
    cta: TASK_DISPLAY.listing.verb,
    feature: ['Structured profile', 'Map & directions', 'Contact + hours', 'Verified before publish'],
  },
  {
    key: 'pdf' as const,
    icon: FileText,
    kicker: TASK_DISPLAY.pdf.plural,
    title: 'The reference behind the entry.',
    body: 'Downloadable documents indexed by topic and category. Open by default. Preview inline before you download.',
    href: '/pdf',
    cta: TASK_DISPLAY.pdf.verb,
    feature: ['Inline preview', 'Free download', 'Indexed by topic', 'Linked from entries'],
  },
]

export function EditableProductShowcase() {
  return (
    <section className="relative">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="max-w-2xl">
          <EditableReveal>
            <p className={dc.type.eyebrow}>Meet the surfaces</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h2 className={`mt-6 ${dc.type.sectionTitle} text-white`}>
              Two surfaces. One connected system.
            </h2>
          </EditableReveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {SURFACES.map((s, i) => (
            <EditableReveal key={s.key} index={i + 1}>
              <Link
                href={s.href}
                className={`group block h-full overflow-hidden ${dc.surface.card} p-8 editable-card-hover sm:p-10`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[color-mix(in_oklab,var(--slot4-accent)_20%,transparent)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--slot4-accent)_40%,transparent)]">
                    <s.icon className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                  </div>
                  <span className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
                    {s.kicker}
                  </span>
                </div>
                <h3 className="editable-display mt-8 text-[clamp(1.5rem,1.6vw+1rem,2.25rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{s.body}</p>
                <ul className="mt-8 grid grid-cols-2 gap-2">
                  {s.feature.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-[var(--slot4-muted-text)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--slot4-accent-soft)] transition duration-300 group-hover:gap-3 group-hover:text-white">
                  {s.cta} <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================================================================== */
/* 4. NEWS / EDITORIAL — p-home-news                                     */
/* ===================================================================== */
function EditorialCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group block overflow-hidden ${dc.surface.card} editable-card-hover`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratioNews}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="editable-media-zoom absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-[8px] bg-black/60 px-2.5 py-1 editable-eyebrow text-[10px] text-white backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
          {categoryOf(post) || 'Feature'}
        </p>
        <h3 className="editable-display mt-3 line-clamp-2 text-[19px] font-medium leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.6] text-[var(--slot4-soft-muted-text)]">
          {excerptOf(post, 130)}
        </p>
      </div>
    </Link>
  )
}

export function EditableEditorialGrid({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 6)
  if (!feed.length) return null
  return (
    <section className="relative bg-[color-mix(in_oklab,var(--slot4-page-bg)_92%,black)]">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <EditableReveal>
            <div className="max-w-xl">
              <p className={dc.type.eyebrow}>We share real impact</p>
              <h2 className={`mt-6 ${dc.type.sectionTitle} text-white`}>
                Latest from the platform.
              </h2>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <Link href={primaryRoute} className={dc.button.ghost}>
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </EditableReveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {feed.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i}>
              <EditorialCard
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                index={i}
              />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================================================================== */
/* 5. CLIENT / TRUST — p-home-client                                     */
/* ===================================================================== */
const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Reviewed before it appears',
    body: 'Every entry passes a manual review. No paid placements. No filler.',
  },
  {
    icon: Layers,
    title: 'Cross-linked by design',
    body: 'Entries cite references. References point back to entries. Discovery compounds.',
  },
  {
    icon: Building2,
    title: 'Local first, always',
    body: 'Built for the neighborhood, not for scale — and better because of it.',
  },
]

export function EditableTrustBand({ posts }: HomeSectionProps) {
  const entryCount = posts.length
  return (
    <section className="relative">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <EditableReveal>
          <p className={dc.type.eyebrow}>Built to be trusted</p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2 className={`mt-6 max-w-3xl ${dc.type.sectionTitle} text-white`}>
            Built for impact — measured by what you can actually find.
          </h2>
        </EditableReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TRUST_PILLARS.map((p, i) => (
            <EditableReveal key={p.title} index={i + 1}>
              <div className={`${dc.surface.soft} h-full p-8`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/[0.05] ring-1 ring-inset ring-white/10">
                  <p.icon className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                </div>
                <h3 className="editable-display mt-6 text-[19px] font-medium tracking-[-0.01em] text-white">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">{p.body}</p>
              </div>
            </EditableReveal>
          ))}
        </div>

        {entryCount > 0 ? (
          <EditableReveal index={4}>
            <div className={`mt-14 flex flex-col items-center justify-between gap-6 ${dc.surface.dark} px-8 py-10 sm:flex-row sm:px-12`}>
              <div>
                <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">Live index</p>
                <p className="editable-display mt-3 text-[clamp(1.5rem,1.4vw+1rem,2rem)] font-medium tracking-[-0.02em] text-white">
                  {entryCount}+ entries live and searchable
                </p>
              </div>
              <Link href="/search" className={dc.button.primary}>
                Search the platform <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

/* ===================================================================== */
/* Legacy compat exports — HomePage.tsx imports the old names.           */
/* ===================================================================== */
export const EditableStoryRail = EditableProductShowcase
export const EditableMagazineSplit = EditableEditorialGrid
export const EditableTimeCollections = ({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) => {
  const sections = timeSections.length
    ? timeSections
    : [{ key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute } as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>]
  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <section className="relative">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {visible.map((section, sIdx) => {
          const isLast = sIdx === visible.length - 1
          const kicker =
            section.key === 'spotlight'
              ? 'Fresh this week'
              : section.key === 'browse'
              ? 'Trending'
              : 'From the archive'
          const title =
            section.key === 'spotlight'
              ? 'New in the last 7 days.'
              : section.key === 'browse'
              ? 'Popular this month.'
              : 'Kept for reference.'
          return (
            <div key={section.key} className={isLast ? '' : 'mb-24 sm:mb-28'}>
              <div className="flex items-end justify-between gap-6">
                <EditableReveal>
                  <div>
                    <p className={dc.type.eyebrow}>{kicker}</p>
                    <h2 className={`mt-6 ${dc.type.subsectionTitle} text-white`}>{title}</h2>
                  </div>
                </EditableReveal>
                <EditableReveal index={1}>
                  <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                    See all <ArrowRight className="h-4 w-4" />
                  </Link>
                </EditableReveal>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <EditorialCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
export const EditableHomeCta = EditableTrustBand
