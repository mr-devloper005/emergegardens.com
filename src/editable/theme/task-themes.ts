import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task themes — single Synex-inspired dark visual language.
  Only kicker/note copy varies per task. Palette + type stay unified.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const SYNEX_FONT = "'Inter Tight', 'Aspekta', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: true,
  fontDisplay: SYNEX_FONT,
  fontBody: SYNEX_FONT,
  bg: '#021229',
  surface: '#0f1c37',
  raised: '#0a1730',
  text: '#f4f6fa',
  muted: '#b7bec9',
  line: 'rgba(255,255,255,0.10)',
  accent: '#0a64ee',
  accentSoft: '#a8c7fe',
  onAccent: '#ffffff',
  glow: 'rgba(10,100,238,0.20)',
  radius: '20px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Field Notes',
    note: 'Considered writing on the systems, places and documents we cover.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Verified places, operators and services — mapped and easy to reach.',
  },
  classified: {
    ...base,
    kicker: 'Marketplace',
    note: 'Live offers, openings and requests from the community.',
  },
  image: {
    ...base,
    kicker: 'Visuals',
    note: 'Photography, plans and diagrams from across the network.',
  },
  sbm: {
    ...base,
    kicker: 'Signal',
    note: 'Curated outbound links worth saving and sharing.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Guides, briefs and source material — free to download.',
  },
  profile: {
    ...base,
    kicker: 'Contributors',
    note: 'People and teams building on the platform.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--slot4-accent-soft': t.accentSoft,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
