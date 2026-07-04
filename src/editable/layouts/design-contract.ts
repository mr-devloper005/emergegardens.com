import type { CSSProperties } from 'react'

/*
  Design contract — Synex-inspired dark systems aesthetic.
  Every downstream component reads tokens from here (or from CSS vars set here),
  so palette / spacing / typography changes cascade automatically.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#021229',
  '--slot4-page-text': '#f4f6fa',
  '--slot4-panel-bg': '#0a1730',
  '--slot4-surface-bg': '#0f1c37',
  '--slot4-muted-text': '#b7bec9',
  '--slot4-soft-muted-text': '#818796',
  '--slot4-accent': '#0a64ee',
  '--slot4-accent-fill': '#0a64ee',
  '--slot4-accent-soft': '#a8c7fe',
  '--slot4-glass': '#c5eafd',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#021229',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#0a1730',
  '--slot4-cream': '#0f1c37',
  '--slot4-warm': '#0a1730',
  '--slot4-lavender': '#0f1c37',
  '--slot4-gray': '#0a1730',
  '--slot4-body-gradient':
    'radial-gradient(1200px 640px at 88% -8%, rgba(10,100,238,0.18), transparent 60%), radial-gradient(900px 600px at 6% 12%, rgba(168,199,254,0.10), transparent 62%)',
  '--editable-page-bg': '#021229',
  '--editable-page-text': '#f4f6fa',
  '--editable-container': '1200px',
  '--editable-border': 'rgba(255,255,255,0.10)',
  '--editable-border-strong': 'rgba(255,255,255,0.16)',
  '--editable-nav-bg': 'rgba(2,18,41,0.72)',
  '--editable-nav-text': '#f4f6fa',
  '--editable-nav-active': '#0a64ee',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#0a64ee',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#0a1730',
  '--editable-footer-bg': '#020c1e',
  '--editable-footer-text': '#f4f6fa',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent-soft)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[color-mix(in_oklab,var(--slot4-accent)_18%,transparent)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[color:var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_2px_18px_rgba(2,10,25,0.35)]',
  shadowStrong: 'shadow-[0_24px_60px_rgba(0,0,0,0.55)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(2,18,41,0.05)_0%,rgba(2,18,41,0.85)_88%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section:
      'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYTight: 'py-14 sm:py-16 lg:py-20',
    sectionYLoose: 'py-24 sm:py-32 lg:py-40',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start sm:w-[260px]',
  },
  type: {
    eyebrow:
      'editable-eyebrow text-[11px] sm:text-xs font-medium text-[var(--slot4-accent-soft)]',
    heroTitle:
      'editable-display font-medium tracking-[-0.03em] leading-[1.02] text-[clamp(3rem,6vw+1rem,6rem)]',
    sectionTitle:
      'editable-display font-medium tracking-[-0.025em] leading-[1.06] text-[clamp(2.25rem,3vw+1rem,3.75rem)]',
    subsectionTitle:
      'editable-display font-medium tracking-[-0.02em] leading-[1.1] text-[clamp(1.5rem,1.4vw+0.9rem,2rem)]',
    body: 'text-base sm:text-[17px] leading-[1.65] text-[var(--slot4-muted-text)]',
    emphasis:
      'editable-display font-medium tracking-[-0.02em] text-[var(--slot4-accent-soft)]',
    stat: 'editable-display font-medium tracking-[-0.03em] leading-[1] text-[clamp(3.25rem,4vw+1.5rem,4.5rem)] text-white',
  },
  surface: {
    card: `rounded-[22px] ${editablePalette.surfaceBg} ring-1 ring-inset ring-white/8 ${editablePalette.shadow}`,
    soft: `rounded-[22px] ${editablePalette.panelBg} ring-1 ring-inset ring-white/6`,
    dark: `rounded-[22px] bg-[#01081a] ring-1 ring-inset ring-white/8 ${editablePalette.shadowStrong}`,
    inline: 'rounded-[14px] bg-white/[0.04] ring-1 ring-inset ring-white/10',
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-medium tracking-[0.005em] text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-110 hover:-translate-y-[1px] active:scale-[0.98] shadow-[0_10px_28px_rgba(10,100,238,0.35)]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium tracking-[0.005em] text-[var(--slot4-page-text)] transition duration-300 hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-[12px] bg-[var(--slot4-accent-soft)] px-6 py-3.5 text-sm font-medium text-[var(--slot4-dark-bg)] transition duration-300 hover:brightness-110 active:scale-[0.98]',
    ghost:
      'inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-accent-soft)] transition duration-300 hover:text-white hover:gap-3',
  },
  badge: {
    pill:
      'inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 editable-eyebrow text-[10px] sm:text-[11px] text-[var(--slot4-muted-text)]',
    accentPill:
      'inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--slot4-accent)_16%,transparent)] px-3 py-1 editable-eyebrow text-[10px] sm:text-[11px] text-[var(--slot4-accent-soft)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--slot4-accent)_35%,transparent)]',
    tag:
      'inline-flex items-center rounded-[8px] bg-white/[0.05] px-2.5 py-1 text-xs text-[var(--slot4-muted-text)] ring-1 ring-inset ring-white/10',
  },
  media: {
    frame:
      'relative overflow-hidden rounded-[20px] ' + editablePalette.mediaBg,
    frameFull:
      'relative overflow-hidden rounded-[24px] ' + editablePalette.mediaBg,
    ratio: 'aspect-[4/5]',
    ratioWide: 'aspect-[16/9]',
    ratioSquare: 'aspect-square',
    ratioNews: 'aspect-[4/3]',
  },
  motion: {
    lift: 'editable-card-hover',
    fade: 'transition duration-500 hover:opacity-90',
    zoom: 'editable-card-hover',
  },
} as const

export const aiLayoutRules = [
  'Every color change flows from editableRootStyle CSS vars — never hardcode hex.',
  'Keep home page structure in HomeSections.tsx to match the Synex reference rhythm.',
  'Section rhythm: eyebrow (mono) + big display h2 + short intro, then grid or feature.',
  'Wrap sections + grid items in EditableReveal with index props for staggered fade-up.',
  'Use dc.motion.lift/zoom via className to unify hover behavior across cards.',
  'Post fetching stays intact; do not replace posts with mocks.',
] as const
