import { getPostData, getSortedPostsData } from '@/lib/posts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'

// Helper components for MDX
const components = {
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
  li: (props: any) => <li className="ml-4" {...props} />,
  a: (props: any) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />,
  code: (props: any) => <code className="bg-gray-100 dark:bg-slate-800 rounded px-1 py-0.5 font-mono text-sm text-pink-600 dark:text-pink-400" {...props} />,
  pre: (props: any) => <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 font-mono text-sm leading-relaxed" {...props} />,
  details: (props: any) => <details className="mb-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg" {...props} />,
  summary: (props: any) => <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white hover:text-primary mb-2" {...props} />,
}

interface Props
{
  params: {
    slug: string
  }
}

export async function generateStaticParams()
{
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: any)
{
  const post = getPostData(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Prasanth Kotaru`,
    description: post.description,
  }
}

export default async function Post({ params }: any)
{
  // Await params in case it's a promise (Next.js 15 change)
  const resolvedParams = await params
  const post = getPostData(resolvedParams.slug)

  if (!post)
  {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-grow pt-24 px-6 pb-20">
        <article className="max-w-3xl mx-auto">
          {/* Post Header */}
          <header className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span>{post.author || 'Prasanth Kotaru'}</span>
            </div>
            {post.tags && (
              <div className="flex gap-2 justify-center mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary-dark">
            <MDXRemote
              source={post.content}
              components={components}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkMath],
                  // @ts-ignore
                  rehypePlugins: [rehypeKatex],
                },
              }}
            />
          </div>
        </article>
      </div>
      <Footer />
    </main>
  )
}
