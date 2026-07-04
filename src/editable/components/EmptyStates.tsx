import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'New entries will appear here as they pass review.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn(`${dc.surface.soft} border border-dashed border-white/12 p-10 text-center`, className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/[0.05] ring-1 ring-inset ring-white/10">
        <SearchX className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
      </div>
      <h2 className="editable-display mt-6 text-[22px] font-medium tracking-[-0.02em] text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className={`${dc.button.secondary} mt-6`}>
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Fresh ${taskLabel} will appear here as they pass review.`}
      actionLabel="Explore"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks — your message has been routed to the team."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
