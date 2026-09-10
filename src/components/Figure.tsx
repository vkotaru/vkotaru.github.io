import fs from 'fs'
import path from 'path'

interface FigureProps
{
  /** Path under public/, e.g. "/figures/cart-pole.svg". */
  src: string
  caption?: string
  /** Width as a percentage of the article column. */
  width?: number
  /** Float the figure beside the following article text. */
  align?: 'left' | 'right' | 'center'
}

/**
 * Inlines a build-time SVG into the page.
 *
 * These figures are rendered from TikZ by scripts/build-figures.sh, which
 * rewrites their ink to `currentColor` so they follow the light/dark theme.
 * That only resolves when the SVG is part of the document -- an <img> loads
 * it as a separate document that cannot see the page's colours -- so the
 * markup is read from disk and inlined here.
 *
 * Sizing and floating use the same .float-figure rules as CartPole.
 */
export default function Figure({
  src,
  caption,
  width = 100,
  align = 'center',
}: FigureProps)
{
  const file = path.join(process.cwd(), 'public', src.replace(/^\//, ''))
  if (!fs.existsSync(file))
  {
    throw new Error(
      `Figure: ${src} not found at ${file}. Run scripts/build-figures.sh?`
    )
  }

  // Drop the intrinsic pt dimensions so the viewBox scales to the column.
  const svg = fs
    .readFileSync(file, 'utf8')
    .replace(/<svg([^>]*?)\s+width='[^']*'/, '<svg$1')
    .replace(/<svg([^>]*?)\s+height='[^']*'/, '<svg$1')

  return (
    <figure
      className={`float-figure float-figure--${align} not-prose my-8 text-gray-800 dark:text-gray-200`}
      style={{
        '--figure-width': `${Math.min(100, Math.max(25, width))}%`,
        float: align === 'center' ? 'none' : align,
      } as React.CSSProperties}
    >
      <div
        className="[&>svg]:w-full [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
