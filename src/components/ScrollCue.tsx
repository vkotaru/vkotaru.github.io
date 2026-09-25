'use client'

import { useEffect, useState } from 'react'

/**
 * A "there is more below" hint for the bottom of the hero.
 *
 * Fades out as soon as the reader scrolls at all -- once they know, the cue
 * has done its job and lingering would just be noise. Hidden outright for
 * anyone who has asked for reduced motion, and on viewports too short for the
 * hero to be scroll-worthy in the first place.
 */
export default function ScrollCue()
{
  const [hidden, setHidden] = useState(false)

  useEffect(() =>
  {
    const onScroll = () => setHidden(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="#publications"
      aria-label="Scroll to content"
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5
                  text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary
                  transition-opacity duration-500 ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <span className="text-[11px] uppercase tracking-[0.18em]">Scroll</span>
      <svg
        className="w-5 h-5 motion-safe:animate-bounce"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </a>
  )
}
