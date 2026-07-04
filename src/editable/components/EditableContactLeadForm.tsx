'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'w-full rounded-[12px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white outline-none transition duration-300 placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent-soft)]'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email" placeholder="you@example.com" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="How can we help?" />
      </div>
      <label className="grid gap-2">
        <span className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you would like to add, correct, or suggest…"
          className={inputClass}
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div
          className={`flex items-start gap-2 rounded-[12px] px-4 py-3 text-sm ring-1 ring-inset ${
            status === 'success'
              ? 'bg-[color-mix(in_oklab,var(--slot4-accent-soft)_18%,transparent)] text-white ring-[color-mix(in_oklab,var(--slot4-accent-soft)_40%,transparent)]'
              : 'bg-red-950/40 text-red-300 ring-red-900/60'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`${dc.button.primary} w-full disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-2">
      <span className="editable-eyebrow text-[10px] text-[var(--slot4-accent-soft)]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  )
}
