'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { formatPostDate } from '@/lib/date'
import { slugify } from '@/lib/toc'

// Cards cycle through a few tints drawn from the page gradient, so a long list
// reads as distinct entries rather than one uniform block. Full class strings,
// since Tailwind cannot see interpolated names.
const CARD_TINTS = [
  'bg-white/70 hover:bg-white dark:bg-slate-800/40 dark:hover:bg-slate-800/70',
  'bg-blue-50/70 hover:bg-blue-50 dark:bg-sky-900/20 dark:hover:bg-sky-900/35',
  'bg-purple-50/70 hover:bg-purple-50 dark:bg-purple-900/20 dark:hover:bg-purple-900/35',
]

export default function BlogList({ posts }: { posts: Post[] })
{
  const [selectedTag, setSelectedTag] = useState<string>('All')

  // Get all unique tags
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(post => post.tags || [])))]

  // The URL hash selects a tag, so /blog#back2basics is shareable and the
  // browser's back button works. Matching is on the slug, not the label.
  useEffect(() =>
  {
    const applyHash = () =>
    {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, '')).toLowerCase()
      if (!hash)
      {
        setSelectedTag('All')
        return
      }
      const tags = Array.from(new Set(posts.flatMap((post) => post.tags || [])))
      setSelectedTag(tags.find((tag) => slugify(tag) === hash) ?? 'All')
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [posts])

  const selectTag = useCallback((tag: string) =>
  {
    setSelectedTag(tag)
    // replaceState rather than assigning location.hash: no scroll jump, and
    // flipping through filters does not fill the history stack.
    const url = tag === 'All'
      ? window.location.pathname + window.location.search
      : `#${slugify(tag)}`
    window.history.replaceState(null, '', url)
  }, [])

  // Filter posts
  const filteredPosts = selectedTag === 'All'
    ? posts
    : posts.filter(post => post.tags?.includes(selectedTag))

  return (
    <>
      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => selectTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No posts found with this tag.</p>
        ) : (
          filteredPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`group rounded-xl border border-gray-200/70 dark:border-slate-700/60 hover:shadow-md transition-all ${CARD_TINTS[index % CARD_TINTS.length]}`}
            >
              <Link href={`/blog/${post.slug}`} className="block p-5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                    {formatPostDate(post.date)}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {post.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </>
  )
}
