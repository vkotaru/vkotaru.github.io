'use client'

import { useEffect, useRef } from 'react'
import PlannerView from '@/components/PlannerView'
import { panels, type Panel } from '@/data/showcase'
import { packages, langColor } from '@/data/packages'

/**
 * The hero's right half: a small 3x2 of panels, with the open-source packages
 * as a row underneath. Tiles hold 16:9 rather than stretching to fill the
 * column -- at full height they were big enough to advertise how soft the
 * 200px source clips are. See `src/data/showcase.ts`.
 *
 * The packages used to be a section of their own further down the page; they
 * moved up here when the research section was cut.
 *
 * The point is recognition before reading: someone who lands here should be
 * able to tell in a second that this is robotics, and the panel labels say
 * which kinds without them having to decode the footage.
 *
 * Playback is started from an effect rather than the `autoPlay` attribute so
 * that a reader who has asked for reduced motion gets the poster frames and
 * nothing moving -- not a frame of motion followed by a pause. Playback also
 * stops once the hero scrolls away, so the decoders are not running for the
 * whole page.
 */
export default function Showcase()
{
  const root = useRef<HTMLDivElement>(null)

  useEffect(() =>
  {
    const el = root.current
    if (!el) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (still.matches) return

    const videos = Array.from(el.querySelectorAll('video'))
    // play() rejects if the element is torn down mid-load, or if a browser
    // decides a muted inline video still needs a gesture. Neither is worth an
    // unhandled rejection -- the poster is a fine fallback.
    const play = (v: HTMLVideoElement) => { void v.play().catch(() => {}) }

    const io = new IntersectionObserver(
      ([entry]) => videos.forEach(v => entry.isIntersecting ? play(v) : v.pause()),
      { threshold: 0 }
    )
    io.observe(el)

    return () => io.disconnect()
  }, [])

  return (
    <div className="space-y-3">
      <div ref={root} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {panels.map(p => <Tile key={p.label} panel={p} className="aspect-video" />)}
      </div>

      {/* The work that is code rather than footage. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {packages.map(pkg => (
          <a
            key={pkg.name}
            href={pkg.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border-[3px] border-white bg-white/70 px-3 py-2.5 shadow-md ring-1 ring-black/10
                       backdrop-blur-sm transition-shadow hover:shadow-xl focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-800/70
                       dark:ring-white/10"
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${langColor[pkg.language] ?? 'bg-gray-400'}`} />
              <span className="truncate font-mono text-[15px] font-semibold text-gray-900 group-hover:text-primary transition-colors dark:text-white">
                {pkg.name}
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z" />
                </svg>
                {pkg.stars}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[13px] text-gray-600 dark:text-gray-400">{pkg.blurb}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

function Tile({ panel, className }: { panel: Panel, className: string })
{
  const external = panel.href?.startsWith('http')
  const moving = panel.src ? /\.(mp4|webm)$/i.test(panel.src) : false

  const frame = `group relative block overflow-hidden rounded-lg border-[3px] border-white bg-slate-200 shadow-md
                 ring-1 ring-black/10 transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-800
                 dark:ring-white/10 ${className}`

  const inner = (
    <>
      {panel.art === 'planner' && (
        <PlannerView className="absolute inset-0 h-full w-full" />
      )}

      {panel.src && (moving
        ? (
          <video
            src={panel.src}
            poster={panel.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )
        : (
          <img
            src={panel.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ))}

      {panel.empty && (
        <span className="absolute inset-0 flex items-center justify-center text-[12px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {panel.empty}
        </span>
      )}

      <span
        className={`pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2 pt-9 text-[14px] font-semibold leading-tight
                    ${panel.src || panel.art
                      ? 'bg-gradient-to-t from-black/80 to-transparent text-white'
                      : 'text-gray-600 dark:text-gray-300'}`}
      >
        {panel.label}
      </span>
    </>
  )

  // A panel with nothing in it yet is a dashed placeholder rather than a solid
  // tile, so it reads as "not filled in" instead of "broken".
  if (!panel.src && !panel.art)
  {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-dashed border-gray-300 dark:border-slate-600 ${className}`}>
        {inner}
      </div>
    )
  }

  // Not everything has somewhere to point yet; an anchor with no href is not a
  // link, so render a plain tile instead of a dead one.
  return panel.href
    ? (
      <a
        href={panel.href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-label={panel.alt}
        className={frame}
      >
        {inner}
      </a>
    )
    : (
      <div role="img" aria-label={panel.alt} className={frame}>
        {inner}
      </div>
    )
}
