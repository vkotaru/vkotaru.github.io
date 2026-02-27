import React from 'react'

type CalloutType = 'note' | 'tip' | 'warning' | 'danger' | 'info'

interface CalloutProps
{
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

interface HighlightProps
{
  color?: 'yellow' | 'green' | 'blue' | 'pink' | 'orange'
  children: React.ReactNode
}

const calloutStyles: Record<CalloutType, { border: string; bg: string; icon: string; label: string }> = {
  note: {
    border: 'border-gray-400 dark:border-gray-500',
    bg: 'bg-gray-50 dark:bg-slate-800/60',
    icon: '\u270F\uFE0F',
    label: 'Note',
  },
  tip: {
    border: 'border-green-400 dark:border-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
    icon: '\uD83D\uDCA1',
    label: 'Tip',
  },
  warning: {
    border: 'border-yellow-400 dark:border-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    icon: '\u26A0\uFE0F',
    label: 'Warning',
  },
  danger: {
    border: 'border-red-400 dark:border-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    icon: '\uD83D\uDED1',
    label: 'Danger',
  },
  info: {
    border: 'border-blue-400 dark:border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    icon: '\u2139\uFE0F',
    label: 'Info',
  },
}

export function Callout({ type = 'note', title, children }: CalloutProps)
{
  const style = calloutStyles[type]

  return (
    <div className={`not-prose my-6 border-l-4 ${style.border} ${style.bg} rounded-r-lg px-4 py-3`}>
      <div className="flex items-center gap-2 mb-1 font-semibold text-sm text-gray-900 dark:text-white">
        <span>{style.icon}</span>
        <span>{title || style.label}</span>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

const highlightColors: Record<string, string> = {
  yellow: 'bg-yellow-200/60 dark:bg-yellow-500/20',
  green: 'bg-green-200/60 dark:bg-green-500/20',
  blue: 'bg-blue-200/60 dark:bg-blue-500/20',
  pink: 'bg-pink-200/60 dark:bg-pink-500/20',
  orange: 'bg-orange-200/60 dark:bg-orange-500/20',
}

export function Highlight({ color = 'yellow', children }: HighlightProps)
{
  return (
    <mark className={`${highlightColors[color]} rounded px-1 py-0.5 text-inherit`}>
      {children}
    </mark>
  )
}
