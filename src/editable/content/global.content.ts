import { slot4BrandConfig } from '@/editable/theme/brand.config'

/*
  Display labels for the two enabled tasks:
  - listing → "Local Directory"
  - pdf     → "Reference Library"
  These strings are the only user-visible names used across the shell and pages.
*/
export const TASK_DISPLAY = {
  listing: {
    singular: 'Directory listing',
    plural: 'Local Directory',
    verb: 'Browse the directory',
    empty: 'No places have been added to the directory yet.',
  },
  pdf: {
    singular: 'Reference',
    plural: 'Reference Library',
    verb: 'Open the library',
    empty: 'No references have been published yet.',
  },
} as const

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A connected directory and reference platform',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Systems for local discovery',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'Directory + Reference Library',
    description:
      'One connected surface for verified local places and the reference material that supports them — mapped, searchable and free to explore.',
    ctaStrip: {
      eyebrow: 'Ready when you are',
      title: 'Build with the directory. Ship with the library.',
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Contact us', href: '/contact' },
    },
    columns: [
      {
        title: 'Discovery',
        links: [
          { label: TASK_DISPLAY.listing.plural, href: '/listings' },
          { label: TASK_DISPLAY.pdf.plural, href: '/pdf' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Sign in', href: '/login' },
          { label: 'Get started', href: '/signup' },
          { label: 'Submit', href: '/create' },
        ],
      },
    ],
    bottomNote: 'Independent. Verified. Built to be linked.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
