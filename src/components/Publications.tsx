'use client'

import { useState } from 'react'
import Image from 'next/image'
import publicationsData from '@/data/publications.json'

type Publication = {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  type: 'journal' | 'conference' | 'preprint'
  image: string
  links: {
    pdf?: string
    arxiv?: string
    video?: string
    github?: string
  }
}

export default function Publications()
{
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const publications: Publication[] = publicationsData.publications

  const filtered = publications.filter(pub =>
  {
    const matchesType = filter === 'all' || pub.type === filter
    const matchesSearch = searchTerm === '' ||
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  const getTypeLabel = (type: string) =>
  {
    switch (type)
    {
      case 'journal': return 'Journal'
      case 'conference': return 'Conference'
      case 'preprint': return 'Preprint'
      default: return type
    }
  }

  const getTypeColor = (type: string) =>
  {
    switch (type)
    {
      case 'journal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'conference': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'preprint': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section id="publications" className="py-12 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Publications</h2>

        {/* Controls */}
        <div className="mb-10 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search publications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {['all', 'journal', 'conference', 'preprint'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === type
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                  }`}
              >
                {type === 'all' ? 'All' : getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-10">
              No publications found.
            </p>
          ) : (
            filtered.map((pub) => (
              <div
                key={pub.id}
                className="bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Image */}
                  <div className="flex-shrink-0 w-full md:w-48 h-40 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-600">
                    <Image
                      src={pub.image}
                      alt={pub.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-start gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(pub.type)}`}>
                        {getTypeLabel(pub.type)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{pub.year}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                      {pub.title}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {pub.authors.map((author, idx) => (
                        <span key={idx} className={author.includes('Prasanth Kotaru') ? 'font-semibold' : ''}>
                          {author}
                          {idx < pub.authors.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 italic mb-4">{pub.venue}</p>

                    {/* Links */}
                    <div className="flex flex-wrap gap-3">
                      {pub.links.pdf && (
                        <a
                          href={pub.links.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          📄 PDF
                        </a>
                      )}
                      {pub.links.arxiv && (
                        <a
                          href={pub.links.arxiv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          📝 arXiv
                        </a>
                      )}
                      {pub.links.video && (
                        <a
                          href={pub.links.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          🎥 Video
                        </a>
                      )}
                      {pub.links.github && (
                        <a
                          href={pub.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          💻 Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
