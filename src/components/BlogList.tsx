'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/lib/posts'

export default function BlogList({ posts }: { posts: Post[] })
{
  const [selectedTag, setSelectedTag] = useState<string>('All')

  // Get all unique tags
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(post => post.tags || [])))]

  // Filter posts
  const filteredPosts = selectedTag === 'All'
    ? posts
    : posts.filter(post => post.tags?.includes(selectedTag))

  return (
    <>
      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-12">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
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
      <div className="space-y-10">
        {filteredPosts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No posts found with this tag.</p>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.slug} className="group border-b border-gray-100 dark:border-gray-800 pb-10 last:border-0">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {post.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
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
