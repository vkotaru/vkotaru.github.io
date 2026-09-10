'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/toc'

/**
 * A rail of dashes pinned to the right edge, one per heading.
 *
 * The current section's title stays visible so the rail reads as a table of
 * contents rather than decoration; hovering expands the rest. It expands into
 * the page margin rather than reserving a column, so the article keeps its
 * full width.
 */
export default function TableOfContents({ items }: { items: TocItem[] })
{
  const [active, setActive] = useState<string | null>(null)

  useEffect(() =>
  {
    if (!items.length) return

    let frame = 0
    const update = () =>
    {
      frame = 0
      // Active = the last heading whose top has passed the reading line.
      let current: string | null = items[0]?.id ?? null
      for (const item of items)
      {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= 120) current = item.id
      }
      setActive(current)
    }

    const onScroll = () =>
    {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () =>
    {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  if (!items.length) return null

  return (
    <nav
      aria-label="Table of contents"
      className="group hidden lg:block fixed right-3 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="rounded-lg px-3 py-2.5 transition-all duration-200
                      group-hover:bg-white/95 dark:group-hover:bg-slate-900/95
                      group-hover:shadow-lg group-hover:backdrop-blur
                      group-hover:ring-1 group-hover:ring-gray-200 dark:group-hover:ring-slate-700">
        <p className="mb-2 max-h-0 overflow-hidden text-right text-[10px] font-semibold uppercase
                      tracking-wider text-gray-400 opacity-0 transition-all duration-200
                      group-hover:mb-2 group-hover:max-h-6 group-hover:opacity-100">
          On this page
        </p>
        <ul className="flex flex-col gap-2 items-end">
          {items.map((item) =>
          {
            const isActive = active === item.id
            return (
              <li key={item.id} className={item.level === 3 ? 'pr-2' : ''}>
                <a href={`#${item.id}`} className="flex items-center justify-end gap-2">
                  <span
                    className={`overflow-hidden truncate whitespace-nowrap text-right text-xs
                                transition-all duration-200
                                group-hover:max-w-[14rem] group-hover:opacity-100
                                ${isActive
                        ? 'max-w-[10rem] opacity-100 text-primary font-medium'
                        : 'max-w-0 opacity-0 text-gray-500 dark:text-gray-400'}`}
                  >
                    {item.text}
                  </span>
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-200
                                ${isActive
                        ? 'w-8 bg-primary'
                        : 'w-4 bg-gray-400 dark:bg-slate-500 group-hover:bg-gray-500 dark:group-hover:bg-slate-400'}`}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
