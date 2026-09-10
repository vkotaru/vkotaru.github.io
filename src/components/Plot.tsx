interface PlotProps
{
  /** Path under public/, e.g. "/figures/mismatch.html". */
  src: string
  caption?: string
  height?: number
  /** Intrinsic width of the embedded plot, in px. Narrower screens scroll. */
  plotWidth?: number
  /** Width as a percentage of the article column. */
  width?: number
  align?: 'left' | 'right' | 'center'
}

/**
 * Embeds a self-contained interactive plot (Bokeh, or any standalone HTML).
 *
 * It has to be an iframe: the file carries its own scripts and styles, and
 * dropping those into the page would leak into everything else. The trade-off
 * is that an iframe is a separate document and cannot see the page's theme, so
 * the plot is rendered on its own light card in both themes rather than
 * half-following the dark mode and looking broken.
 */
export default function Plot({
  src,
  caption,
  height = 520,
  plotWidth = 700,
  width = 100,
  align = 'center',
}: PlotProps)
{
  return (
    <figure
      className={`float-figure float-figure--${align} not-prose my-8`}
      style={{
        '--figure-width': `${Math.min(100, Math.max(25, width))}%`,
        float: align === 'center' ? 'none' : align,
      } as React.CSSProperties}
    >
      {/* The plot has a fixed intrinsic width, so on a narrow screen this box
          scrolls it sideways rather than squashing it -- same treatment as a
          wide equation. No background: the embedded plot is drawn transparent
          so the page shows through and it reads in either theme. */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-x-auto">
        <iframe
          src={src}
          loading="lazy"
          title={caption ?? 'Interactive plot'}
          style={{
            width: plotWidth, minWidth: plotWidth, height,
            border: 0, display: 'block', background: 'transparent',
          }}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
