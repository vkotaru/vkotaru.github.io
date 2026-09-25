import Image from 'next/image'
import Link from 'next/link'
import Vehicle from '@/components/Vehicle'
import Showcase from '@/components/Showcase'
import ScrollCue from '@/components/ScrollCue'

/**
 * The front page: who I am on the left, what I have built on the right.
 *
 * The panels are deliberately small. Blown up to fill their column they only
 * advertised the source footage, most of which is 200px wide -- at this size
 * the grid reads as a contact sheet and the softness stops showing.
 *
 * The old hero said "Software Engineer, Motion Control" and nothing else;
 * nobody landing here could tell it was robotics.
 */
export default function Hero()
{
  return (
    <section id="about" className="relative min-h-screen flex items-center pt-20 pb-20 lg:pb-24 px-6 sm:px-8 xl:px-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-[1700px] mx-auto">
        <div className="grid lg:grid-cols-[20rem_1fr] xl:grid-cols-[minmax(300px,26rem)_1fr] gap-10 lg:gap-8 xl:gap-12 items-center">

          {/* Left: who */}
          <div>
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 dark:ring-slate-700/50">
                <Image
                  src="/media/pkMarch2024-640.jpg"
                  alt="Prasanth Kotaru"
                  fill
                  sizes="144px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="min-w-0">
                {/* Sized off the viewport rather than the breakpoint: the column is a
                    third of the window, so a fixed 48px name wrapped between 1280
                    and 1400 and cleared 1440 by two pixels. */}
                <h1 className="text-4xl sm:text-5xl lg:text-[clamp(2.25rem,3vw,2.75rem)] font-bold text-gray-900 dark:text-white mb-2">
                  Prasanth Kotaru
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Roboticist
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 justify-center sm:justify-start mt-5">
              <a
                href="https://github.com/vkotaru"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://scholar.google.com/citations?user=ZCumxcUAAAAJ&hl=en&oi=ao"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all"
                aria-label="Google Scholar"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/prasanthkotaru/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            {/* Experience. The marks are generic vehicle silhouettes, not
                company logos -- see `Vehicle`. */}
            <div className="mt-5 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Experience</h2>
              <ul className="space-y-1 text-sm">
                {([
                  ['robotaxi', 'Waymo'],
                  ['car', 'Tesla'],
                  ['tractor', 'Monarch Tractor'],
                ] as const).map(([kind, name]) => (
                  <li key={name} className="flex items-center gap-2.5 text-gray-900 dark:text-white">
                    <Vehicle kind={kind} className="h-6 w-6 shrink-0 text-gray-500 dark:text-gray-400" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div className="mt-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Education</h2>
              <div className="space-y-1.5 text-sm">
                <div className="bg-white/80 dark:bg-slate-800/80 px-3 py-2 rounded-lg">
                  <p className="text-gray-900 dark:text-white">
                    Ph.D., Mechanical Engineering, University of California, Berkeley, CA, 2022
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    <strong>Dissertation:</strong> <Link href="/dissertation" className="text-primary hover:underline">Dynamics and Control for Collaborative Aerial Manipulation</Link>
                  </p>
                </div>

                <div className="bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded">
                  <p className="text-gray-900 dark:text-white">
                    M.S., Mechanical Engineering, Carnegie Mellon University, Pittsburgh, PA, 2017
                  </p>
                </div>

                <div className="bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded">
                  <p className="text-gray-900 dark:text-white">
                    B.Tech., Mechanical Engineering, Indian Institute of Technology, Madras, India, 2014
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: what */}
          <Showcase />

        </div>
      </div>

      <ScrollCue />
    </section>
  )
}
