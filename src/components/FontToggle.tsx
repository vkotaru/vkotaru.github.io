'use client'

import { useEffect, useRef, useState } from 'react'

const FONTS = [
  { id: 'manrope', label: 'Manrope', note: 'rounded, roomy (default)' },
  { id: 'grotesk', label: 'Space Grotesk', note: 'geometric sans' },
  { id: 'inter', label: 'Inter', note: 'neutral sans' },
  { id: 'serif', label: 'Source Serif', note: 'for long reads' },
  { id: 'legible', label: 'Atkinson', note: 'high legibility' },
] as const

type FontId = (typeof FONTS)[number]['id']

/**
 * Body-font picker, sibling to ThemeToggle.
 *
 * The choice is an attribute on <html> plus a localStorage key; the actual
 * swap happens in CSS via --font-body. A tiny script in the layout applies the
 * saved value before first paint so there is no flash of the default font.
 */
export default function FontToggle()
{
  const [open, setOpen] = useState(false)
  const [font, setFont] = useState<FontId>('manrope')
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() =>
  {
    setMounted(true)
    const saved = (typeof localStorage !== 'undefined'
      && localStorage.getItem('font')) as FontId | null
    if (saved && FONTS.some((f) => f.id === saved)) setFont(saved)
  }, [])

  useEffect(() =>
  {
    if (!open) return
    const onDown = (e: MouseEvent) =>
    {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () =>
    {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (id: FontId) =>
  {
    setFont(id)
    setOpen(false)
    try
    {
      localStorage.setItem('font', id)
      // 'manrope' is the CSS default, so it needs no attribute.
      if (id === 'manrope') document.documentElement.removeAttribute('data-font')
      else document.documentElement.setAttribute('data-font', id)
    }
    catch { /* private mode: the choice just will not persist */ }
  }

  // Match ThemeToggle: reserve the space until mounted so the header does not jump.
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
        aria-label="Change font"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold leading-none tracking-tight">Aa</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1 z-50"
        >
          {FONTS.map((f) => (
            <button
              key={f.id}
              role="menuitemradio"
              aria-checked={font === f.id}
              onClick={() => choose(f.id)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 ${font === f.id
                ? 'text-primary font-medium'
                : 'text-gray-700 dark:text-gray-300'
                }`}
            >
              <span className="block">{f.label}</span>
              <span className="block text-[11px] text-gray-400">{f.note}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
