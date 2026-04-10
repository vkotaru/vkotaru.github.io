const packages = [
  {
    name: 'udaan',
    description: 'Flying and floating models — quadrotors, quadrotors with suspended payloads, and more.',
    language: 'Python',
    github: 'https://github.com/vkotaru/udaan',
    stars: 10,
  },
  {
    name: 'pygeomech',
    description: 'Symbolic computation of dynamics on smooth manifolds.',
    language: 'Python',
    github: 'https://github.com/vkotaru/pygeomech',
    stars: 2,
  },
  {
    name: 'kite_ros',
    description: 'Cable-suspended Hybrid Aerial Inflight-grasping and Transportation.',
    language: 'C++',
    github: 'https://github.com/vkotaru/kite_ros',
    stars: 5,
  },
]

const langColor: Record<string, string> = {
  Python: 'bg-blue-400',
  'C++': 'bg-pink-500',
  TypeScript: 'bg-blue-600',
  Rust: 'bg-orange-600',
}

export default function Packages()
{
  return (
    <section id="packages" className="py-12 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Open Source Packages
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <a
              key={pkg.name}
              href={pkg.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-5 hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {pkg.name}
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-4">
                {pkg.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded-full ${langColor[pkg.language] || 'bg-gray-400'}`} />
                  {pkg.language}
                </span>
                {pkg.stars && pkg.stars > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {pkg.stars}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
