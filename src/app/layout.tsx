import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: 'Prasanth Kotaru | Motion Control Engineer',
  description: 'Software Engineer specializing in Motion Control at Waymo LLC. PhD in Mechanical Engineering from UC Berkeley. Research in nonlinear control, geometric optimal control, and safe multi-robot collaboration.',
  keywords: ['Prasanth Kotaru', 'robotics', 'control theory', 'aerial manipulation', 'Waymo', 'UC Berkeley'],
  authors: [{ name: 'Prasanth Kotaru' }],
  openGraph: {
    title: 'Prasanth Kotaru',
    description: 'Software Engineer, Motion Control at Waymo LLC',
    type: 'website',
    url: 'https://vkotaru.github.io',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
})
{
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
