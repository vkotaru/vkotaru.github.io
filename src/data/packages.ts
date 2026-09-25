/**
 * Open-source packages, shown as a row under the hero's media grid.
 *
 * Star counts are hand-maintained and go stale -- these were checked against
 * the GitHub API on 2026-09-23. `blurb` has to survive `truncate` in a third
 * of the media column, so keep it to about four words.
 */
export type Package = {
  name: string
  blurb: string
  language: string
  github: string
  stars: number
}

export const packages: Package[] = [
  {
    name: 'udaan',
    blurb: 'Quadrotor + payload models',
    language: 'Python',
    github: 'https://github.com/vkotaru/udaan',
    stars: 18,
  },
  {
    name: 'pygeomech',
    blurb: 'Dynamics on manifolds, symbolically',
    language: 'Python',
    github: 'https://github.com/vkotaru/pygeomech',
    stars: 3,
  },
  {
    name: 'nonlinear_controls',
    blurb: 'Lyapunov, MPC, geometric control',
    language: 'C++',
    github: 'https://github.com/vkotaru/nonlinear_controls',
    stars: 18,
  },
]

export const langColor: Record<string, string> = {
  Python: 'bg-blue-400',
  'C++': 'bg-pink-500',
  TypeScript: 'bg-blue-600',
  Rust: 'bg-orange-600',
}
