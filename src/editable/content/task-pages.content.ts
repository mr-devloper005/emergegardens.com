import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Considered writing about the places and references we cover.',
    description: 'Long-form notes tying entries in the directory to the source material behind them.',
    filterLabel: 'Filter topic',
    secondaryNote: 'Editorial pacing over feed pacing.',
    chips: ['Long-form', 'Cross-linked', 'Editorial'],
  },
  classified: {
    eyebrow: 'Marketplace',
    headline: 'Live offers and requests from the community.',
    description: 'Quick-scan entries meant to be acted on the same day.',
    filterLabel: 'Filter category',
    secondaryNote: 'Fast, practical, action-first.',
    chips: ['Live', 'Fast scan', 'Community'],
  },
  sbm: {
    eyebrow: 'Signal',
    headline: 'Outbound links worth saving and sharing.',
    description: 'A curated shelf of external references we recommend.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources with calm metadata.',
    chips: ['Curated', 'External', 'Reference'],
  },
  profile: {
    eyebrow: 'Contributors',
    headline: 'People and teams building on the platform.',
    description: 'Contributor profiles for the people behind entries and references.',
    filterLabel: 'Filter contributor category',
    secondaryNote: 'Identity and credibility, up front.',
    chips: ['People', 'Trust', 'Cards'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Guides, briefs and reports — indexed by topic.',
    description: 'The Reference Library holds downloadable source material for everything in the directory. Free, open, cross-linked.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Preview inline. Download when useful.',
    chips: ['Downloadable', 'Indexed', 'Open'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'Verified places, mapped and easy to reach.',
    description: 'Structured directory entries with contact, hours, tags and location — reviewed before publish.',
    filterLabel: 'Filter category',
    secondaryNote: 'Verified. Mapped. Compare-friendly.',
    chips: ['Verified', 'Mapped', 'Structured'],
  },
  image: {
    eyebrow: 'Visuals',
    headline: 'Photography, plans and diagrams from across the network.',
    description: 'A gallery-first surface for the visual side of the platform.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Images lead, text follows.',
    chips: ['Gallery', 'Visual', 'Contributor'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
