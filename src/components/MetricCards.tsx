import React from 'react'
import { collectMetrics } from '@/lib/metrics'

/**
 * The same metrics as <MetricGrid>, but nothing is hidden: every card carries
 * its own text. Hover (or tab to) a card and it lifts and sharpens; at rest the
 * body sits back a little so the page still reads as a grid of headings rather
 * than eight paragraphs.
 *
 * No state, no click target -- on a phone you simply read all eight.
 */
export default function MetricCards({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
})
{
  const items = collectMetrics(children)
  if (items.length === 0) return null

  return (
    <div className="not-prose my-8">
      {title && (
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
          <span className="text-[11px] uppercase tracking-wider text-gray-400">
            all of them, all the time
          </span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) =>
        {
          const { icon, name, short, children: body } = item.props
          return (
            <div
              key={name}
              tabIndex={0}
              className="group rounded-xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl leading-none" aria-hidden="true">{icon}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">
                    {name}
                  </div>
                  {short && (
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {short}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2.5 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-200 [&>p]:mb-0">
                {body}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
