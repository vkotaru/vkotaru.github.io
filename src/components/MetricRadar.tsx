'use client'

import React, { useMemo, useState } from 'react'
import { collectMetrics, type MetricProps } from '@/lib/metrics'

/**
 * The same metrics as <MetricGrid>, drawn as a radar so several controllers can
 * be laid over each other. Scores come off each <Metric>'s `scores` prop:
 *
 *   <Metric icon="🎯" name="Region of attraction" scores={{ LQR: 2, MPC: 4 }}>...
 *
 * Hover or focus an axis and its metric's text appears under the chart; click a
 * legend entry to drop a series. Scores are a qualitative 0-5 -- say so in the
 * caption, they are an opinion, not a benchmark.
 */

const SERIES_COLORS = ['#2563eb', '#f59e0b', '#ea4aaa', '#10b981']

// Wide enough that the longest side label ('Robustness', with its icon)
// clears the right edge of the viewBox.
const SIZE = { w: 500, h: 360, cx: 240, cy: 176, r: 124 }
const RINGS = 5

/** Axis angle for slot i, starting at 12 o'clock and going clockwise. */
function angleOf(index: number, count: number): number
{
  return (-Math.PI / 2) + (index * 2 * Math.PI) / count
}

function pointAt(index: number, count: number, radius: number): [number, number]
{
  const a = angleOf(index, count)
  return [SIZE.cx + radius * Math.cos(a), SIZE.cy + radius * Math.sin(a)]
}

/** Two lines for anything long enough to collide with its neighbours. */
function labelLines(name: string): string[]
{
  if (name.length <= 11) return [name]
  const words = name.split(' ')
  if (words.length === 1) return [name]
  const head = words.slice(0, -1).join(' ')
  return [head, words[words.length - 1]]
}

export default function MetricRadar({
  title,
  caption,
  children,
}: {
  title?: string
  caption?: string
  children: React.ReactNode
})
{
  const items = collectMetrics(children)
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState<string[]>([])

  // Series order is first-appearance order across the metrics, so the legend
  // matches the order the scores were written in.
  const series = useMemo(() =>
  {
    const names: string[] = []
    for (const item of items)
    {
      for (const key of Object.keys(item.props.scores ?? {}))
      {
        if (!names.includes(key)) names.push(key)
      }
    }
    return names.map((name, index) => ({ name, color: SERIES_COLORS[index % SERIES_COLORS.length] }))
  }, [items])

  if (items.length === 0) return null

  const count = items.length
  const current: MetricProps = items[Math.min(active, count - 1)].props

  const polygon = (seriesName: string) => items
    .map((item, index) =>
    {
      const value = item.props.scores?.[seriesName] ?? 0
      const [x, y] = pointAt(index, count, (SIZE.r * value) / RINGS)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <figure className="not-prose my-8 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/40 overflow-hidden">
      <div className="flex items-baseline justify-between gap-3 px-4 pt-3">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {title ?? 'Performance Metrics'}
        </span>
        <span className="text-[11px] uppercase tracking-wider text-gray-400">
          hover an axis
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-2 px-2 pb-3">
        <svg
          viewBox={`0 0 ${SIZE.w} ${SIZE.h}`}
          className="w-full lg:w-[58%] h-auto"
          role="img"
          aria-label={`Radar chart comparing ${series.map((s) => s.name).join(', ')} across ${count} metrics`}
        >
          {/* Rings and spokes */}
          {Array.from({ length: RINGS }, (_, ring) => (
            <polygon
              key={ring}
              points={items
                .map((_, index) =>
                {
                  const [x, y] = pointAt(index, count, (SIZE.r * (ring + 1)) / RINGS)
                  return `${x.toFixed(1)},${y.toFixed(1)}`
                })
                .join(' ')}
              className="fill-none stroke-gray-200 dark:stroke-slate-700"
              strokeWidth={1}
            />
          ))}
          {items.map((_, index) =>
          {
            const [x, y] = pointAt(index, count, SIZE.r)
            return (
              <line
                key={index}
                x1={SIZE.cx}
                y1={SIZE.cy}
                x2={x}
                y2={y}
                className="stroke-gray-200 dark:stroke-slate-700"
                strokeWidth={1}
              />
            )
          })}

          {/* The axis being read, highlighted behind everything else */}
          {(() =>
          {
            const [x, y] = pointAt(active, count, SIZE.r)
            return (
              <line
                x1={SIZE.cx}
                y1={SIZE.cy}
                x2={x}
                y2={y}
                className="stroke-primary"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )
          })()}

          {/* One polygon per series */}
          {series.map((s) =>
          {
            const hidden = muted.includes(s.name)
            return (
              <polygon
                key={s.name}
                points={polygon(s.name)}
                fill={s.color}
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                fillOpacity={hidden ? 0 : 0.14}
                strokeOpacity={hidden ? 0.15 : 1}
                className="transition-opacity"
              />
            )
          })}

          {/* Vertices for the active axis, so the reading is easy to compare */}
          {series.map((s) =>
          {
            if (muted.includes(s.name)) return null
            const value = items[active].props.scores?.[s.name] ?? 0
            const [x, y] = pointAt(active, count, (SIZE.r * value) / RINGS)
            return <circle key={s.name} cx={x} cy={y} r={4} fill={s.color} />
          })}

          {/* Axis labels double as the picker */}
          {items.map((item, index) =>
          {
            const a = angleOf(index, count)
            const [x, y] = pointAt(index, count, SIZE.r + 22)
            const cos = Math.cos(a)
            const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end'
            const lines = labelLines(item.props.name)
            const dy = Math.sin(a) < -0.5 ? -lines.length * 11 : Math.sin(a) > 0.5 ? 4 : -4
            const selected = index === active
            return (
              <g
                key={item.props.name}
                tabIndex={0}
                role="button"
                aria-label={item.props.name}
                aria-pressed={selected}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="cursor-pointer focus:outline-none"
              >
                <text
                  x={x}
                  y={y + dy}
                  textAnchor={anchor}
                  fontSize={11}
                  className={selected
                    ? 'fill-primary dark:fill-blue-300 font-semibold'
                    : 'fill-gray-500 dark:fill-gray-400'}
                >
                  {lines.map((line, lineIndex) => (
                    <tspan key={line} x={x} dy={lineIndex === 0 ? 0 : 12}>
                      {lineIndex === 0 ? `${item.props.icon}\u2009\u2009${line}` : line}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend + the metric being read */}
        <div className="lg:w-[42%] px-2 lg:px-3">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {series.map((s) =>
            {
              const hidden = muted.includes(s.name)
              return (
                <button
                  key={s.name}
                  type="button"
                  aria-pressed={!hidden}
                  onClick={() => setMuted((list) =>
                    list.includes(s.name) ? list.filter((n) => n !== s.name) : [...list, s.name])}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all ${hidden
                    ? 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-600'
                    : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200'
                    }`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: hidden ? 'transparent' : s.color, boxShadow: `inset 0 0 0 2px ${s.color}` }}
                  />
                  {s.name}
                </button>
              )
            })}
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/40 p-3 sm:min-h-[9rem]">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none" aria-hidden="true">{current.icon}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{current.name}</span>
            </div>
            {current.short && (
              <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">
                {current.short}
              </div>
            )}
            <div className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300 [&>p]:mb-0">
              {current.children}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {series.filter((s) => !muted.includes(s.name)).map((s) => (
                <span
                  key={s.name}
                  className="text-[11px] font-mono rounded px-1.5 py-0.5 text-gray-700 dark:text-gray-200"
                  style={{ backgroundColor: `${s.color}22` }}
                >
                  {s.name} {current.scores?.[s.name] ?? 0}/{RINGS}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
