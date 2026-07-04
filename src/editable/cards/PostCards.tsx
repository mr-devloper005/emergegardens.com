import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/*
  Card language — Synex reference:
  - Borderless dark panels with soft inner ring
  - Media zoom on hover, panel lift -4px, 400ms ease-premium (via .editable-card-hover)
  - Eyebrow above title, no all-caps title styling
  - Display-family headings, letter-spacing -0.02em
*/

export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured read',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} editable-card-hover`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[620px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="editable-media-zoom absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,25,0.15)_0%,rgba(2,10,25,0.92)_75%)]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className="editable-eyebrow text-[11px] text-[var(--slot4-accent-soft)]">{label}</span>
          <h3 className="editable-display mt-6 max-w-3xl text-[clamp(2rem,3vw+1rem,3.5rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-white/70 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-[12px] bg-white/95 px-5 py-3 text-sm font-medium text-[#021229] transition duration-300 group-hover:bg-white">
            Open <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} editable-card-hover`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratioSquare}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="editable-media-zoom absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-[8px] bg-[color-mix(in_oklab,#021229_85%,transparent)] px-2 py-1 editable-eyebrow text-[10px] text-white/90 backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5">
        <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
          {getEditableCategory(post)}
        </p>
        <h3 className="editable-display mt-3 line-clamp-2 text-[19px] font-medium leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-2 text-[13px] leading-[1.55] ${pal.softMutedText}`}>
          {getEditableExcerpt(post, 105)}
        </p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group block min-w-0 ${dc.surface.soft} p-5 editable-card-hover`}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.05] editable-mono text-[11px] text-[var(--slot4-accent-soft)] ring-1 ring-inset ring-white/10">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
            {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-2 line-clamp-2 text-[17px] font-medium leading-[1.25] tracking-[-0.015em] text-white">
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-[13px] leading-[1.55] ${pal.softMutedText}`}>
            {getEditableExcerpt(post, 105)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 editable-card-hover sm:grid-cols-[240px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/11] sm:aspect-auto sm:min-h-[200px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="editable-media-zoom absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 p-2 sm:py-5 sm:pr-6">
        <p className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">
          {getEditableCategory(post)} · {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[clamp(1.35rem,1.4vw+0.9rem,1.9rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-[14px] leading-[1.65] ${pal.softMutedText}`}>
          {getEditableExcerpt(post, 180)}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-accent-soft)] transition duration-300 group-hover:gap-3 group-hover:text-white">
          Open <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
