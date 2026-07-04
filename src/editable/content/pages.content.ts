import { slot4BrandConfig } from '@/editable/theme/brand.config'

const site = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: `${site} — Local Directory and Reference Library`,
      description:
        'A connected surface for verified local entries and the reference material that supports them. Mapped, searchable and free to explore.',
      openGraphTitle: `${site} — Local Directory and Reference Library`,
      openGraphDescription:
        'Discover verified local entries and downloadable reference material — mapped, cross-linked and free to explore.',
      keywords: ['local directory', 'reference library', 'downloads', 'directory platform'],
    },
    hero: {
      badge: 'Systems for local discovery',
      title: ['Directory that answers.', 'Library that explains.'],
      description:
        'One connected surface for verified local entries and the reference material that supports them — mapped, cross-linked and free to explore.',
      primaryCta: { label: 'Open the directory', href: '/listings' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
      searchPlaceholder: 'Search entries, references, categories…',
      focusLabel: 'What we cover',
      featureCardBadge: 'Live rotation',
      featureCardTitle: 'The newest entries and references stay in view.',
      featureCardDescription: 'Fresh submissions surface first so returning visitors always land on something they have not seen.',
    },
    intro: {
      badge: 'Modular by design',
      title: 'Foundation for local discovery.',
      paragraphs: [
        `${site} pairs a searchable local directory with an open reference library. One reads, the other resolves — and both cross-link.`,
        'Every entry carries a verified profile: address, hours, contact, tags. Every reference carries downloadable source material, indexed by topic and category.',
        'Nothing is walled off. Nothing is behind a form. Discovery is meant to feel obvious.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Verified local directory with structured profiles.',
        'Downloadable reference library indexed by topic.',
        'Cross-linked so entries cite their sources.',
        'Free, mapped, searchable, updated weekly.',
      ],
      primaryLink: { label: 'Open the directory', href: '/listings' },
      secondaryLink: { label: 'Open the library', href: '/pdf' },
    },
    stats: {
      eyebrow: 'What the system does',
      title: 'Built for repeat use.',
      items: [
        { value: '2×', label: 'faster than open search' },
        { value: '100%', label: 'entries verified before publish' },
        { value: 'Free', label: 'directory + library, always' },
      ],
    },
    cta: {
      badge: 'Get started',
      title: 'Two surfaces. One connected system.',
      description: 'Open the directory to browse verified local entries. Open the library to pull the reference material behind them.',
      primaryCta: { label: 'Open the directory', href: '/listings' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: '{label}',
      descriptionSuffix: 'The most recent entries in this section.',
    },
  },
  about: {
    badge: 'About the platform',
    title: 'Verified local entries. Open reference material. One surface.',
    description: `${site} is a directory and reference library built to make local discovery feel less like search and more like knowing the neighborhood.`,
    paragraphs: [
      'The directory is verified — every entry passes a review before it appears. The library is open — every reference is a real downloadable file, indexed by topic and category.',
      'The two surfaces are cross-linked. An entry can cite a reference. A reference can point back to the entry it supports. Discovery is meant to compound.',
    ],
    values: [
      {
        title: 'Verified before published',
        description: 'Every directory entry is reviewed for accuracy before it appears. No sales lists, no filler.',
      },
      {
        title: 'Free to download',
        description: 'The reference library is open — every entry is a real, searchable file you can save.',
      },
      {
        title: 'Built to connect',
        description: 'Entries and references cross-link so browsing turns into a small tour instead of a dead end.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${site}`,
    title: 'Reach the team behind the directory and the library.',
    description: 'Tell us what to add, correct, or verify. Directory suggestions, missing references, corrections — all welcome.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search entries and references across the platform.',
    },
    hero: {
      badge: 'Search everything',
      title: 'One search across the directory and the library.',
      description: 'Keywords, categories, tags — pull matching entries and references together.',
      placeholder: 'Search entries, references, categories…',
    },
    resultsTitle: 'Latest results',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit an entry or a reference to the platform.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description: 'Sign in to open the workspace and submit a directory entry or a reference file.',
    },
    hero: {
      badge: 'Workspace',
      title: 'Submit an entry or a reference.',
      description: 'Pick the type, add the details, attach the file if needed. We review before it appears.',
    },
    formTitle: 'Submission details',
    submitLabel: 'Send for review',
    successTitle: 'Submission received. We will review shortly.',
  },
  auth: {
    login: {
      metadataDescription: `Sign in to ${site}.`,
      badge: 'Contributor',
      title: 'Welcome back.',
      description: 'Sign in to keep submitting entries, references, and edits.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create an account on ${site}.`,
      badge: 'Get started',
      title: 'Create a contributor account.',
      description: 'One account is enough to submit entries and references to both surfaces.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related field notes',
      fallbackTitle: 'Field note',
    },
    listing: {
      relatedTitle: 'More from the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Visual',
    },
    profile: {
      relatedTitle: 'Related contributors',
      fallbackDescription: 'Contributor details will appear here.',
      visitButton: 'Visit',
    },
  },
} as const
