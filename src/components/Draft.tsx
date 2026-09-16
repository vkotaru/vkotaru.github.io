/**
 * Marks prose that is still an unedited draft.
 *
 * Tinted and rule-marked in development, so while writing you can see at a
 * glance what has not had your pass yet. In a production build it renders its
 * children plainly and disappears -- so if a marker is left in by accident the
 * published post is unaffected, it just loses the highlight.
 *
 * Remove the wrapper as you rewrite each block.
 */
export default function Draft({
  children,
  label = 'drafted',
}: {
  children: React.ReactNode
  label?: string
})
{
  if (process.env.NODE_ENV === 'production') return <>{children}</>

  return (
    <div className="draft-block" data-draft-label={label}>
      {children}
    </div>
  )
}
