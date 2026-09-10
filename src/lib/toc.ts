export interface TocItem
{
  id: string
  text: string
  level: number
}

/**
 * Heading id / tag slug. Used by BOTH the rendered heading and the table of
 * contents link, so the two can never drift apart.
 */
export function slugify(input: string): string
{
  return input
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/\$[^$]*\$/g, '')      // inline math
    .replace(/[*_]{1,2}/g, '')      // emphasis markers
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Pull h2/h3 headings out of the raw MDX source. Fenced code is skipped so
 * that a commented "## ..." inside a code block is not mistaken for a heading.
 */
export function extractToc(markdown: string): TocItem[]
{
  const items: TocItem[] = []
  let inFence = false

  for (const line of markdown.split('\n'))
  {
    if (/^\s*```/.test(line))
    {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const raw = match[2]
    items.push({
      id: slugify(raw),
      text: raw.replace(/[*_`]/g, '').trim(),
      level: match[1].length,
    })
  }

  return items
}
