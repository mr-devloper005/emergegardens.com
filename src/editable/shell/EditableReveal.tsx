'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Stagger index — inline transitionDelay = index * step. */
  index?: number
  /** Delay step in ms (defaults to 80). */
  step?: number
  /** Custom threshold for the IntersectionObserver (0-1). */
  threshold?: number
  /** Wrapper element tag. */
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
  className?: string
  style?: CSSProperties
}

/*
  Scroll-reveal wrapper.
  - Hidden state is applied ONLY after mount, so JS-off visitors still see content.
  - Uses `prefers-reduced-motion` via CSS (no armed class → no motion).
  - IntersectionObserver flips is-visible when the element enters the viewport.
*/
export default function EditableReveal({
  children,
  index = 0,
  step = 80,
  threshold = 0.15,
  as: Tag = 'div',
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVisible(true)
      return
    }

    setArmed(true)

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  const delay = index > 0 ? `${index * step}ms` : undefined

  const classes = [
    'editable-reveal',
    armed && 'editable-reveal-armed',
    visible && 'is-visible',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={ref as any}
      className={classes}
      style={{ transitionDelay: delay, ...style }}
    >
      {children}
    </Tag>
  )
}
