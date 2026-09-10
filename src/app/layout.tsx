import type { Metadata } from 'next'
import {
  Atkinson_Hyperlegible,
  Inter,
  Manrope,
  Source_Serif_4,
  Space_Grotesk,
} from 'next/font/google'
import ThemeProvider from '@/components/ThemeProvider'
import './globals.css'

// Self-hosted by next/font, so switching fonts costs no extra network request
// at runtime and the static export stays self-contained.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
})
const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
})

const FONT_VARS = [spaceGrotesk, manrope, inter, sourceSerif, atkinson]
  .map((f) => f.variable)
  .join(' ')

// Applies the saved font before first paint, so the page never flashes the
// default and then swap. Same trick next-themes uses for the colour scheme.
const FONT_INIT = `(function(){try{var f=localStorage.getItem('font');if(f)document.documentElement.setAttribute('data-font',f);}catch(e){}})();`

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
    images: [{ url: 'https://vkotaru.github.io/media/pkMarch2024.png', width: 400, height: 400, alt: 'Prasanth Kotaru' }],
  },
  twitter: {
    card: 'summary',
    title: 'Prasanth Kotaru | Motion Control Engineer',
    description: 'Software Engineer, Motion Control at Waymo LLC',
    images: ['https://vkotaru.github.io/media/pkMarch2024.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
})
{
  return (
    <html lang="en" className={FONT_VARS} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: FONT_INIT }} />
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-primary focus:font-medium">
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
