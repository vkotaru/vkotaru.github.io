import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSortedPostsData } from '@/lib/posts'
import BlogList from '@/components/BlogList'

export const metadata = {
  title: 'Blog | Prasanth Kotaru',
  description: 'Research notes, tutorials, and thoughts on control theory and robotics.',
}

export default function Blog()
{
  const posts = getSortedPostsData()

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <Header />
      <div className="flex-grow pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            Research notes, tutorials, and thoughts on control theory, robotics, and autonomous systems.
          </p>

          <BlogList posts={posts} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
