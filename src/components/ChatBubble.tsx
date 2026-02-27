import React from 'react'

interface ChatBubbleProps
{
  from?: 'me' | 'other'
  name?: string
  image?: string
  children: React.ReactNode
}

interface ChatWindowProps
{
  title?: string
  variant?: 'phone' | 'desktop'
  scroll?: boolean
  children: React.ReactNode
}

export function ChatBubble({ from = 'other', name, image, children }: ChatBubbleProps)
{
  const isSent = from === 'me'

  return (
    <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} my-1`}>
      {name && (
        <span className="text-xs text-gray-400 dark:text-gray-500 mb-1 px-1">
          {name}
        </span>
      )}
      {image && (
        <div className={`max-w-[75%] mb-1 ${isSent ? 'rounded-[18px] rounded-br-[4px]' : 'rounded-[18px] rounded-bl-[4px]'} overflow-hidden`}>
          <img src={image} alt="" className="w-full h-auto block" />
        </div>
      )}
      <div
        className={`
          max-w-[75%] px-4 py-2.5 text-sm leading-relaxed
          ${isSent
            ? 'bg-blue-500 text-white rounded-[18px] rounded-br-[4px]'
            : 'bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white rounded-[18px] rounded-bl-[4px]'
          }
        `}
      >
        {children}
      </div>
    </div>
  )
}

export function ChatWindow({ title, variant = 'phone', scroll = false, children }: ChatWindowProps)
{
  const isDesktop = variant === 'desktop'

  return (
    <div className={`not-prose my-8 mx-auto overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 ${isDesktop
      ? `max-w-2xl rounded-xl flex flex-col${scroll ? ' aspect-video' : ''}`
      : 'max-w-sm rounded-[24px]'
      }`}>
      {/* Header bar */}
      <div className={`bg-gray-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-slate-700 ${isDesktop ? 'rounded-t-xl' : ''}`}>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {title ? title[0].toUpperCase() : '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {title || 'Messages'}
          </p>
          <p className="text-xs text-green-500">online</p>
        </div>
        {isDesktop ? (
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
        ) : (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className={`bg-white dark:bg-slate-900 px-4 py-4 flex flex-col gap-0.5 ${isDesktop ? (scroll ? 'flex-1 overflow-y-auto' : '') : 'min-h-[120px]'}`}>
        {children}
      </div>

      {/* Input bar (decorative) */}
      <div className="bg-gray-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-2 border-t border-gray-200 dark:border-slate-700">
        {isDesktop && (
          <button className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
        )}
        <div className={`flex-1 bg-white dark:bg-slate-700 px-4 py-1.5 text-xs text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-slate-600 ${isDesktop ? 'rounded-lg' : 'rounded-full'}`}>
          Message...
        </div>
        <button className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
