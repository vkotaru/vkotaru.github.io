'use client'

import { useState } from 'react'

/**
 * A digression -- the "wait, what is that" explainer that interrupts a paper
 * read-through. Visually distinct from Callout, which is for asides about the
 * post itself rather than about the subject.
 *
 * Open by default: these are notes to self, and a collapsed explainer is one
 * you will not read. Pass `collapsed` for the long ones.
 */
export default function Tangent({
  title,
  children,
  collapsed = false,
}: {
  title: string
  children: React.ReactNode
  collapsed?: boolean
})
{
  const [open, setOpen] = useState(!collapsed)

  return (
    <div className="not-prose my-7 rounded-lg border border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-500/5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-600 dark:text-sky-400 shrink-0">
          Tangent
        </span>
        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-sky-500 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 prose prose-sm dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300">
          {children}
        </div>
      )}
    </div>
  )
}
