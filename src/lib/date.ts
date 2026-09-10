/**
 * Frontmatter dates are calendar days ("2026-08-26"), not instants. A bare
 * date string parses as UTC midnight, which formats as the *previous* day
 * anywhere behind UTC. Anchor at noon UTC so every timezone lands on the
 * same calendar day, then render it in Pacific.
 *
 * Lives outside posts.ts so client components can import it -- posts.ts
 * pulls in `fs` and cannot be bundled for the browser.
 */
export function formatPostDate(date: string): string
{
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  })
}
