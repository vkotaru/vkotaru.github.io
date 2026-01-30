export default function Research()
{
  return (
    <section id="research" className="py-12 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Research Interests
        </h2>

        {/* Description - Now at top */}
        <p className="mb-6 text-base text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto">
          I specialize in developing control and estimation algorithms for autonomous systems, with expertise spanning
          autonomous vehicles, robotics, and multi-agent systems. My work combines classical control theory with modern
          machine learning and AI techniques to build robust, scalable solutions. Currently, I focus on creating
          fleet-wide control tools, state observers, and detection systems that enhance safety and performance across
          entire autonomous vehicle fleets. Previously, I researched nonlinear control strategies and collaborative
          systems for aerial robotics, developing methods for safe multi-robot coordination and manipulation.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Video Embed */}
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Bo1-U9dzL-M"
              title="Research Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Interests List */}
          <div className="flex flex-col gap-4 h-full">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700 flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Autonomous Vehicle Control
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Fleet-wide control systems, state estimation, and ML/AI-driven safety tools for autonomous driving.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700 flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Multi-Aerial Collaborative Manipulation
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Nonlinear control and coordination algorithms for safe multi-robot aerial systems and payload transport.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
